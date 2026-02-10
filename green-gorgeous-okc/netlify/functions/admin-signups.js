// Admin endpoint to view signups (protected with basic auth)
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Basic auth credentials (in production, use environment variables)
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'test123';

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
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const db = await initDB();
    
    // Get query parameters
    const { limit = 100, offset = 0, sort = 'created_at', order = 'DESC' } = event.queryStringParameters || {};
    
    // Validate sort/order
    const validSort = ['id', 'email', 'zip_code', 'created_at'].includes(sort) ? sort : 'created_at';
    const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
    
    // Get signups with pagination
    const signups = await db.all(
      `SELECT id, email, zip_code, created_at, ip_address 
       FROM signups 
       ORDER BY ${validSort} ${validOrder} 
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    
    // Get total count
    const countResult = await db.get('SELECT COUNT(*) as total FROM signups');
    const total = countResult.total;
    
    // Get stats
    const stats = await db.all(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT zip_code) as unique_zips,
        DATE(created_at) as date,
        COUNT(*) as daily_count
      FROM signups 
      WHERE created_at >= DATE('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    // Get ZIP code distribution
    const zipStats = await db.all(`
      SELECT 
        zip_code,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM signups), 2) as percentage
      FROM signups 
      GROUP BY zip_code 
      ORDER BY count DESC
      LIMIT 10
    `);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          signups,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            has_more: (parseInt(offset) + parseInt(limit)) < total
          },
          stats: {
            total_subscribers: total,
            unique_zip_codes: zipStats.length,
            last_7_days: stats
          },
          zip_code_distribution: zipStats
        }
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