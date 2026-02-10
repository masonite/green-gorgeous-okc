// Track newsletter link clicks and redirect
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
  const { newsletter_id, email_hash, url, company_id } = event.queryStringParameters || {};
  const decodedUrl = url ? decodeURIComponent(url) : 'https://nicelawnokc.com';
  
  if (!newsletter_id) {
    // Redirect even if tracking fails
    return {
      statusCode: 302,
      headers: {
        'Location': decodedUrl
      },
      body: ''
    };
  }

  try {
    const db = await initDB();
    
    // Track the click
    if (email_hash) {
      await db.run(`
        UPDATE newsletter_deliveries 
        SET clicked_at = CURRENT_TIMESTAMP 
        WHERE newsletter_id = ? 
        AND clicked_at IS NULL
        LIMIT 1
      `, [newsletter_id]);
      
      // If this is a company link, track as lead
      if (company_id) {
        await db.run(`
          INSERT INTO newsletter_leads (newsletter_id, company_id, clicked_url, created_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `, [newsletter_id, company_id, decodedUrl]);
      }
    }
    
    // Redirect to the actual URL
    return {
      statusCode: 302,
      headers: {
        'Location': decodedUrl
      },
      body: ''
    };
    
  } catch (error) {
    console.error('Track click error:', error);
    
    // Still redirect even on error
    return {
      statusCode: 302,
      headers: {
        'Location': decodedUrl
      },
      body: ''
    };
  }
};