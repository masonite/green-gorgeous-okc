// Newsletter admin API endpoints
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const dbDir = '/tmp/newsletter_db';
const dbPath = path.join(dbDir, 'signups.db');

async function initDB() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  return db;
}

function checkAuth(authHeader) {
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'test123';
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  return username === ADMIN_USER && password === ADMIN_PASS;
}

exports.handler = async function(event, context) {
  // Check authentication
  if (!checkAuth(event.headers.authorization)) {
    return {
      statusCode: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Access"',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Authentication required' })
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const db = await initDB();
    const path = event.path.replace('/.netlify/functions/newsletter-admin', '');
    
    // Route requests
    if (event.httpMethod === 'GET') {
      if (path === '/templates' || path === '/templates/') {
        // Get all templates
        const templates = await db.all('SELECT * FROM newsletter_templates ORDER BY created_at DESC');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, templates })
        };
      }
      else if (path.startsWith('/templates/')) {
        // Get single template
        const id = path.split('/')[2];
        const template = await db.get('SELECT * FROM newsletter_templates WHERE id = ?', [id]);
        
        if (!template) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Template not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, template })
        };
      }
      else if (path === '/scheduled' || path === '/scheduled/') {
        // Get scheduled newsletters
        const { status, limit = 50, offset = 0 } = event.queryStringParameters || {};
        
        let query = 'SELECT * FROM scheduled_newsletters';
        let params = [];
        
        if (status) {
          query += ' WHERE status = ?';
          params.push(status);
        }
        
        query += ' ORDER BY scheduled_for DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const newsletters = await db.all(query, params);
        
        // Get counts
        const counts = await db.all(`
          SELECT status, COUNT(*) as count 
          FROM scheduled_newsletters 
          GROUP BY status
        `);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            newsletters,
            counts: counts.reduce((acc, row) => {
              acc[row.status] = row.count;
              return acc;
            }, {})
          })
        };
      }
      else if (path.startsWith('/scheduled/')) {
        // Get single scheduled newsletter
        const id = path.split('/')[2];
        const newsletter = await db.get('SELECT * FROM scheduled_newsletters WHERE id = ?', [id]);
        
        if (!newsletter) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Newsletter not found' })
          };
        }
        
        // Get delivery stats
        const deliveryStats = await db.get(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN opened_at IS NOT NULL THEN 1 ELSE 0 END) as opened,
            SUM(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END) as clicked
          FROM newsletter_deliveries 
          WHERE newsletter_id = ?
        `, [id]);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            newsletter,
            stats: deliveryStats
          })
        };
      }
      else if (path === '/stats' || path === '/stats/') {
        // Get newsletter statistics
        const [totalSent, openRate, clickRate, topNewsletters] = await Promise.all([
          db.get('SELECT COUNT(*) as count FROM scheduled_newsletters WHERE status = "sent"'),
          db.get(`
            SELECT 
              ROUND(AVG(CASE WHEN opened_at IS NOT NULL THEN 1.0 ELSE 0 END) * 100, 2) as rate
            FROM newsletter_deliveries 
            WHERE status = 'sent'
          `),
          db.get(`
            SELECT 
              ROUND(AVG(CASE WHEN clicked_at IS NOT NULL THEN 1.0 ELSE 0 END) * 100, 2) as rate
            FROM newsletter_deliveries 
            WHERE status = 'sent'
          `),
          db.all(`
            SELECT 
              n.id,
              n.subject,
              n.scheduled_for,
              COUNT(d.id) as sent_count,
              SUM(CASE WHEN d.opened_at IS NOT NULL THEN 1 ELSE 0 END) as opened_count,
              SUM(CASE WHEN d.clicked_at IS NOT NULL THEN 1 ELSE 0 END) as clicked_count
            FROM scheduled_newsletters n
            LEFT JOIN newsletter_deliveries d ON n.id = d.newsletter_id
            WHERE n.status = 'sent'
            GROUP BY n.id
            ORDER BY n.scheduled_for DESC
            LIMIT 10
          `)
        ]);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            stats: {
              total_sent: totalSent.count,
              open_rate: openRate.rate || 0,
              click_rate: clickRate.rate || 0,
              top_newsletters: topNewsletters
            }
          })
        };
      }
      else {
        // Default endpoint info
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            endpoints: [
              'GET /templates - List all templates',
              'GET /templates/:id - Get specific template',
              'POST /templates - Create new template',
              'PUT /templates/:id - Update template',
              'DELETE /templates/:id - Delete template',
              'GET /scheduled - List scheduled newsletters',
              'GET /scheduled/:id - Get newsletter with stats',
              'POST /scheduled - Schedule new newsletter',
              'PUT /scheduled/:id - Update newsletter',
              'DELETE /scheduled/:id - Cancel newsletter',
              'GET /stats - Get newsletter statistics'
            ]
          })
        };
      }
    }
    else if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body || '{}');
      
      if (path === '/templates' || path === '/templates/') {
        // Create new template
        const { name, subject, html_content } = data;
        
        if (!name || !subject || !html_content) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing required fields' })
          };
        }
        
        const result = await db.run(
          `INSERT INTO newsletter_templates (name, subject, html_content) VALUES (?, ?, ?)`,
          [name, subject, html_content]
        );
        
        const template = await db.get('SELECT * FROM newsletter_templates WHERE id = ?', [result.lastID]);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, template })
        };
      }
      else if (path === '/scheduled' || path === '/scheduled/') {
        // Schedule new newsletter
        const { template_id, subject, content, scheduled_for } = data;
        
        if (!subject || !content || !scheduled_for) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing required fields' })
          };
        }
        
        // Validate scheduled_for is in the future
        const scheduledDate = new Date(scheduled_for);
        if (scheduledDate <= new Date()) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Scheduled date must be in the future' })
          };
        }
        
        const result = await db.run(
          `INSERT INTO scheduled_newsletters (template_id, subject, content, scheduled_for) VALUES (?, ?, ?, ?)`,
          [template_id || null, subject, content, scheduled_for]
        );
        
        const newsletter = await db.get('SELECT * FROM scheduled_newsletters WHERE id = ?', [result.lastID]);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, newsletter })
        };
      }
      else if (path === '/preview' || path === '/preview/') {
        // Preview newsletter (no database save)
        const { subject, content, template_id } = data;
        
        let htmlContent = '';
        
        if (template_id) {
          const template = await db.get('SELECT html_content FROM newsletter_templates WHERE id = ?', [template_id]);
          if (template) {
            htmlContent = template.html_content
              .replace('{{subject}}', subject || 'Newsletter Preview')
              .replace('{{month}}', new Date().toLocaleString('default', { month: 'long' }))
              .replace('{{content}}', content || '');
          }
        }
        
        // If no template or template not found, use basic preview
        if (!htmlContent) {
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${subject || 'Preview'}</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .preview-header { background: #f0f0f0; padding: 20px; text-align: center; }
              </style>
            </head>
            <body>
              <div class="preview-header">
                <h1>${subject || 'Newsletter Preview'}</h1>
                <p>This is a preview of your newsletter content</p>
              </div>
              <div>${content || 'No content provided'}</div>
            </body>
            </html>
          `;
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, html: htmlContent })
        };
      }
    }
    else if (event.httpMethod === 'PUT') {
      const data = JSON.parse(event.body || '{}');
      
      if (path.startsWith('/templates/')) {
        // Update template
        const id = path.split('/')[2];
        const { name, subject, html_content } = data;
        
        const updates = [];
        const params = [];
        
        if (name !== undefined) {
          updates.push('name = ?');
          params.push(name);
        }
        if (subject !== undefined) {
          updates.push('subject = ?');
          params.push(subject);
        }
        if (html_content !== undefined) {
          updates.push('html_content = ?');
          params.push(html_content);
        }
        
        if (updates.length === 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'No fields to update' })
          };
        }
        
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);
        
        await db.run(
          `UPDATE newsletter_templates SET ${updates.join(', ')} WHERE id = ?`,
          params
        );
        
        const template = await db.get('SELECT * FROM newsletter_templates WHERE id = ?', [id]);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, template })
        };
      }
      else if (path.startsWith('/scheduled/')) {
        // Update scheduled newsletter
        const id = path.split('/')[2];
        const { subject, content, scheduled_for, status } = data;
        
        const updates = [];
        const params = [];
        
        if (subject !== undefined) {
          updates.push('subject = ?');
          params.push(subject);
        }
        if (content !== undefined) {
          updates.push('content = ?');
          params.push(content);
        }
        if (scheduled_for !== undefined) {
          updates.push('scheduled_for = ?');
          params.push(scheduled_for);
        }
        if (status !== undefined) {
          updates.push('status = ?');
          params.push(status);
          
          if (status === 'sent') {
            updates.push('sent_at = CURRENT_TIMESTAMP');
          }
        }
        
        if (updates.length === 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'No fields to update' })
          };
        }
        
        params.push(id);
        
        await db.run(
          `UPDATE scheduled_newsletters SET ${updates.join(', ')} WHERE id = ?`,
          params
        );
        
        const newsletter = await db.get('SELECT * FROM scheduled_newsletters WHERE id = ?', [id]);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, newsletter })
        };
      }
    }
    else if (event.httpMethod === 'DELETE') {
      if (path.startsWith('/templates/')) {
        // Delete template
        const id = path.split('/')[2];
        
        // Check if template is used in any newsletters
        const used = await db.get(
          'SELECT COUNT(*) as count FROM scheduled_newsletters WHERE template_id = ?',
          [id]
        );
        
        if (used.count > 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              error: 'Cannot delete template that is used in scheduled newsletters' 
            })
          };
        }
        
        await db.run('DELETE FROM newsletter_templates WHERE id = ?', [id]);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Template deleted' })
        };
      }
      else if (path.startsWith('/scheduled/')) {
        // Cancel scheduled newsletter
        const id = path.split('/')[2];
        
        // Only allow deletion if not already sent
        const newsletter = await db.get('SELECT status FROM scheduled_newsletters WHERE id = ?', [id]);
        
        if (!newsletter) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Newsletter not found' })
          };
        }
        
        if (newsletter.status === 'sent') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Cannot delete already sent newsletter' })
          };
        }
        
        await db.run('DELETE FROM scheduled_newsletters WHERE id = ?', [id]);
        await db.run('DELETE FROM newsletter_deliveries WHERE newsletter_id = ?', [id]);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Newsletter cancelled' })
        };
      }
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };
    
  } catch (error) {
    console.error('Newsletter admin error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};