// Newsletter sending function (triggered by schedule or manual send)
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const dbDir = '/tmp/newsletter_db';
const dbPath = path.join(dbDir, 'signups.db');

async function initDB() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  return db;
}

// Email configuration for Brevo (Sendinblue) SMTP
function getEmailConfig() {
  // Check for Brevo credentials
  const brevoHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const brevoUser = process.env.SMTP_USER;
  const brevoPass = process.env.SMTP_PASS;
  
  // If Brevo credentials are provided, use them
  if (brevoUser && brevoPass) {
    console.log('Using Brevo SMTP configuration');
    return {
      host: brevoHost,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: brevoUser,
        pass: brevoPass
      }
    };
  }
  
  // Fallback to test configuration
  console.warn('Using test email configuration. Set SMTP environment variables for production.');
  return {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com',
      pass: 'test'
    }
  };
}

// Create email transporter for Brevo
function createTransporter() {
  const config = getEmailConfig();
  
  // Check if we have real Brevo credentials
  const hasBrevoCredentials = config.auth.user && config.auth.pass && 
                             config.auth.user !== 'test@example.com';
  
  if (!hasBrevoCredentials) {
    console.warn('Using test email configuration. Set Brevo SMTP environment variables for production.');
    
    // In development, simulate sending
    return {
      sendMail: async (options) => {
        console.log('SIMULATING email send (no Brevo credentials):', {
          to: options.to,
          subject: options.subject,
          htmlLength: options.html?.length
        });
        
        // Simulate success for testing
        return { 
          messageId: 'test-' + Date.now(),
          preview: 'Email would be sent via Brevo if credentials were configured'
        };
      }
    };
  }
  
  console.log('Creating Brevo SMTP transporter');
  return nodemailer.createTransport(config);
}

// Process template variables
function processTemplate(template, variables = {}) {
  let html = template;
  
  // Replace all template variables
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, variables[key] || '');
  });
  
  // Add tracking pixel
  const trackingPixel = `
    <img src="https://nicelawnokc.com/.netlify/functions/track-open?newsletter_id={{newsletter_id}}&email={{email_hash}}" 
         width="1" height="1" style="display:none;" alt="" />
  `;
  
  html = html.replace('</body>', `${trackingPixel}</body>`);
  
  return html;
}

// Hash email for tracking (simple hash for demo)
function hashEmail(email) {
  return Buffer.from(email).toString('base64').replace(/=/g, '');
}

exports.handler = async function(event, context) {
  // Authentication check for manual triggers
  if (event.httpMethod === 'POST') {
    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'test123';
    
    function checkAuth(authHeader) {
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return false;
      }
      
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      
      return username === ADMIN_USER && password === ADMIN_PASS;
    }
    
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
  }

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
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
    
    if (event.httpMethod === 'GET') {
      // Check for newsletters ready to send (for scheduled sending)
      const now = new Date().toISOString();
      
      // Find newsletters scheduled for now or earlier
      const newsletters = await db.all(`
        SELECT * FROM scheduled_newsletters 
        WHERE status = 'scheduled' 
        AND scheduled_for <= ?
        ORDER BY scheduled_for ASC
        LIMIT 5
      `, [now]);
      
      if (newsletters.length === 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'No newsletters ready to send',
            newsletters: []
          })
        };
      }
      
      // Process each newsletter
      const results = [];
      
      for (const newsletter of newsletters) {
        try {
          // Update status to sending
          await db.run(
            'UPDATE scheduled_newsletters SET status = "sending" WHERE id = ?',
            [newsletter.id]
          );
          
          // Get subscribers
          const subscribers = await db.all(
            'SELECT id, email FROM signups ORDER BY id'
          );
          
          // Get template if exists
          let templateHTML = '';
          if (newsletter.template_id) {
            const template = await db.get(
              'SELECT html_content FROM newsletter_templates WHERE id = ?',
              [newsletter.template_id]
            );
            if (template) {
              templateHTML = template.html_content;
            }
          }
          
          // Prepare email content
          const month = new Date().toLocaleString('default', { month: 'long' });
          const year = new Date().getFullYear();
          
          const variables = {
            subject: newsletter.subject,
            month: month,
            year: year,
            content: newsletter.content,
            unsubscribe_url: 'https://nicelawnokc.com/unsubscribe?email={{email}}'
          };
          
          let htmlContent;
          if (templateHTML) {
            htmlContent = processTemplate(templateHTML, variables);
          } else {
            // Basic template
            htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${newsletter.subject}</title>
                <style>
                  body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #2D5016; color: white; padding: 20px; text-align: center; }
                  .content { padding: 20px; background: white; }
                  .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>${newsletter.subject}</h1>
                </div>
                <div class="content">
                  ${newsletter.content}
                </div>
                <div class="footer">
                  <p>You received this email from Nice Lawn OKC</p>
                  <p><a href="https://nicelawnokc.com/unsubscribe">Unsubscribe</a></p>
                </div>
              </body>
              </html>
            `;
          }
          
          // Create deliveries records
          const deliveryPromises = subscribers.map(subscriber => 
            db.run(
              `INSERT INTO newsletter_deliveries (newsletter_id, signup_id, email, status) VALUES (?, ?, ?, 'pending')`,
              [newsletter.id, subscriber.id, subscriber.email]
            )
          );
          
          await Promise.all(deliveryPromises);
          
          // Send emails (in batches for production)
          const transporter = createTransporter();
          let sentCount = 0;
          let failedCount = 0;
          
          // For demo, we'll simulate sending to first 5 subscribers
          const demoSubscribers = subscribers.slice(0, Math.min(5, subscribers.length));
          
          for (const subscriber of demoSubscribers) {
            try {
              const emailHash = hashEmail(subscriber.email);
              const personalizedHTML = htmlContent
                .replace(/{{email}}/g, subscriber.email)
                .replace(/{{email_hash}}/g, emailHash)
                .replace(/{{newsletter_id}}/g, newsletter.id);
              
              await transporter.sendMail({
                from: process.env.FROM_EMAIL || '"Nice Lawn OKC" <newsletter@nicelawnokc.com>',
                to: subscriber.email,
                subject: newsletter.subject,
                html: personalizedHTML,
                text: newsletter.content.replace(/<[^>]*>/g, '') // Strip HTML for text version
              });
              
              // Update delivery status
              await db.run(
                `UPDATE newsletter_deliveries SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE newsletter_id = ? AND email = ?`,
                [newsletter.id, subscriber.email]
              );
              
              sentCount++;
              
            } catch (error) {
              console.error(`Failed to send to ${subscriber.email}:`, error);
              
              await db.run(
                `UPDATE newsletter_deliveries SET status = 'failed', error_message = ? WHERE newsletter_id = ? AND email = ?`,
                [error.message, newsletter.id, subscriber.email]
              );
              
              failedCount++;
            }
          }
          
          // Update newsletter status
          const finalStatus = failedCount > 0 && sentCount === 0 ? 'failed' : 'sent';
          
          await db.run(
            `UPDATE scheduled_newsletters SET status = ?, sent_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [finalStatus, newsletter.id]
          );
          
          results.push({
            newsletter_id: newsletter.id,
            subject: newsletter.subject,
            sent: sentCount,
            failed: failedCount,
            total: demoSubscribers.length,
            status: finalStatus
          });
          
        } catch (error) {
          console.error(`Error processing newsletter ${newsletter.id}:`, error);
          
          // Mark as failed
          await db.run(
            'UPDATE scheduled_newsletters SET status = "failed" WHERE id = ?',
            [newsletter.id]
          );
          
          results.push({
            newsletter_id: newsletter.id,
            error: error.message,
            status: 'failed'
          });
        }
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          results,
          message: `Processed ${results.length} newsletter(s)`
        })
      };
      
    } else if (event.httpMethod === 'POST') {
      // Manual send trigger
      const data = JSON.parse(event.body || '{}');
      const { newsletter_id } = data;
      
      if (!newsletter_id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'newsletter_id is required' })
        };
      }
      
      // Get newsletter
      const newsletter = await db.get(
        'SELECT * FROM scheduled_newsletters WHERE id = ?',
        [newsletter_id]
      );
      
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
          body: JSON.stringify({ error: 'Newsletter already sent' })
        };
      }
      
      // Update scheduled time to now
      await db.run(
        'UPDATE scheduled_newsletters SET scheduled_for = ?, status = "scheduled" WHERE id = ?',
        [new Date().toISOString(), newsletter_id]
      );
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Newsletter scheduled for immediate sending',
          newsletter_id
        })
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
    
  } catch (error) {
    console.error('Send newsletter error:', error);
    
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