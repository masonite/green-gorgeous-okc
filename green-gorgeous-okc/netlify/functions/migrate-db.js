// Database migration function to add newsletter tables
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

exports.handler = async function(event, context) {
  // Basic auth check
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

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const db = await initDB();
    
    // Create newsletter tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS newsletter_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        html_content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS scheduled_newsletters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        scheduled_for DATETIME NOT NULL,
        status TEXT DEFAULT 'scheduled',
        sent_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES newsletter_templates(id)
      )
    `);
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS newsletter_deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        newsletter_id INTEGER,
        signup_id INTEGER,
        email TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        sent_at DATETIME,
        opened_at DATETIME,
        clicked_at DATETIME,
        error_message TEXT,
        FOREIGN KEY (newsletter_id) REFERENCES scheduled_newsletters(id),
        FOREIGN KEY (signup_id) REFERENCES signups(id)
      )
    `);
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS newsletter_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        newsletter_id INTEGER,
        signup_id INTEGER,
        company_id INTEGER,
        clicked_url TEXT,
        converted_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (newsletter_id) REFERENCES scheduled_newsletters(id),
        FOREIGN KEY (signup_id) REFERENCES signups(id)
      )
    `);
    
    // Insert default template
    const defaultTemplate = await db.get('SELECT id FROM newsletter_templates WHERE name = "Default Monthly"');
    
    if (!defaultTemplate) {
      const defaultHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body {
            font-family: 'Open Sans', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #2D5016;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2D5016;
            margin-top: 0;
        }
        h2 {
            color: #7CB342;
            border-bottom: 2px solid #FFC107;
            padding-bottom: 10px;
        }
        .tip {
            background-color: #f8fff3;
            border-left: 4px solid #7CB342;
            padding: 15px;
            margin: 20px 0;
        }
        .cta {
            background-color: #FFC107;
            color: #333;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
            margin: 30px 0;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        .signature {
            color: #2D5016;
            font-weight: bold;
            margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header, .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="color: white; margin: 0;">🌱 Nice Lawn OKC</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">{{month}} Lawn Care Newsletter</p>
    </div>
    
    <div class="content">
        {{content}}
        
        <div class="cta">
            🚀 <strong>READY FOR A PERFECT LAWN?</strong><br>
            Get matched with vetted local professionals who offer exclusive rates to our subscribers.
        </div>
        
        <p class="signature">Happy gardening,<br>
        The Nice Lawn OKC Team</p>
        
        <div class="footer">
            <p>You received this email because you signed up at nicelawnokc.com</p>
            <p><a href="{{unsubscribe_url}}" style="color: #2D5016;">Unsubscribe</a></p>
            <p>© 2026 Nice Lawn OKC. Serving Oklahoma City, Edmond, Norman, Moore, and Nichols Hills.</p>
        </div>
    </div>
</body>
</html>`;
      
      await db.run(
        `INSERT INTO newsletter_templates (name, subject, html_content) VALUES (?, ?, ?)`,
        ['Default Monthly', 'Your {{month}} Oklahoma Lawn Care Guide', defaultHTML]
      );
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database migration completed successfully',
        tables_created: [
          'newsletter_templates',
          'scheduled_newsletters', 
          'newsletter_deliveries',
          'newsletter_leads'
        ]
      })
    };
    
  } catch (error) {
    console.error('Migration error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Migration failed',
        details: error.message 
      })
    };
  }
};