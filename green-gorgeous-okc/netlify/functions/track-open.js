// Track newsletter opens via tracking pixel
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
  const { newsletter_id, email_hash } = event.queryStringParameters || {};
  
  if (!newsletter_id || !email_hash) {
    // Return transparent pixel even if tracking fails
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // 1x1 transparent GIF
      isBase64Encoded: true
    };
  }

  try {
    const db = await initDB();
    
    // Find the delivery record
    // Note: In production, you'd want to decode the email hash properly
    // For demo, we'll update the first matching delivery
    await db.run(`
      UPDATE newsletter_deliveries 
      SET opened_at = CURRENT_TIMESTAMP 
      WHERE newsletter_id = ? 
      AND opened_at IS NULL
      LIMIT 1
    `, [newsletter_id]);
    
    // Return transparent pixel
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      isBase64Encoded: true
    };
    
  } catch (error) {
    console.error('Track open error:', error);
    
    // Still return pixel even on error
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      isBase64Encoded: true
    };
  }
};