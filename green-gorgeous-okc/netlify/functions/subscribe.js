// Netlify Function to handle newsletter signups
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = '/tmp/newsletter_db';
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'signups.db');

// Initialize database
async function initDB() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT
    )
  `);
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      signup_id INTEGER,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      newsletter_type TEXT,
      FOREIGN KEY (signup_id) REFERENCES signups(id)
    )
  `);
  
  return db;
}

exports.handler = async function(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body);
    const { email, zip_code } = data;
    
    // Basic validation
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email required' })
      };
    }
    
    if (!zip_code || !/^\d{5}$/.test(zip_code)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid 5-digit ZIP code required' })
      };
    }
    
    // Initialize database
    const db = await initDB();
    
    // Check if email already exists
    const existing = await db.get(
      'SELECT id FROM signups WHERE email = ?',
      [email]
    );
    
    if (existing) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ 
          error: 'Email already subscribed',
          id: existing.id 
        })
      };
    }
    
    // Insert new signup
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'];
    const userAgent = event.headers['user-agent'];
    
    const result = await db.run(
      `INSERT INTO signups (email, zip_code, ip_address, user_agent) 
       VALUES (?, ?, ?, ?)`,
      [email, zip_code, ip, userAgent]
    );
    
    const signupId = result.lastID;
    
    // Log the subscription
    await db.run(
      'INSERT INTO newsletter_logs (signup_id, newsletter_type) VALUES (?, ?)',
      [signupId, 'welcome']
    );
    
    // Get stats
    const stats = await db.get('SELECT COUNT(*) as total FROM signups');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed to newsletter!',
        id: signupId,
        stats: {
          total_subscribers: stats.total,
          your_position: stats.total // They're the latest
        },
        next_steps: 'Check your email for the welcome newsletter'
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    
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