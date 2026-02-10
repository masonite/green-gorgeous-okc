# Email Delivery Setup for NiceLawnOKC Newsletter

## Current Status: TEST MODE
The newsletter system is currently in **test mode** - it simulates email sending but doesn't actually deliver emails.

## Problem
The `send-newsletter.js` function checks for SMTP environment variables. If not found, it uses test configuration that only logs emails instead of sending them.

## Solution Options

### Option 1: Gmail SMTP (Quickest)
1. **Create App Password:**
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate app password for "Mail"
   - Note: `xxxxxxxxxxxxxxxx`

2. **Set Netlify Environment Variables:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL="Nice Lawn OKC <your-email@gmail.com>"
   ADMIN_USER=admin
   ADMIN_PASS=secure-password-here
   ```

### Option 2: SendGrid (Recommended for Production)
1. **Sign up for SendGrid** (free tier: 100 emails/day)
2. **Create API Key** with "Mail Send" permissions
3. **Set Netlify Environment Variables:**
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   FROM_EMAIL="Nice Lawn OKC <newsletter@nicelawnokc.com>"
   ADMIN_USER=admin
   ADMIN_PASS=secure-password-here
   ```

### Option 3: Mailgun
1. **Sign up for Mailgun** (free tier: 5,000 emails/month)
2. **Get SMTP credentials** from dashboard
3. **Set Netlify Environment Variables:**
   ```
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=postmaster@your-domain.mailgun.org
   SMTP_PASS=your-mailgun-password
   FROM_EMAIL="Nice Lawn OKC <newsletter@nicelawnokc.com>"
   ADMIN_USER=admin
   ADMIN_PASS=secure-password-here
   ```

## How to Set Environment Variables in Netlify

1. Go to Netlify Dashboard
2. Select `green-gorgeous-okc` site
3. Site settings → Environment variables
4. Add each variable from above
5. Redeploy site

## Testing Email Delivery

### Test 1: Manual Send via Admin
1. Visit: `https://nicelawnokc.com/admin`
2. Login with admin credentials
3. Click "Send Test Newsletter"
4. Check console for logs

### Test 2: API Call
```bash
curl -X POST https://nicelawnokc.com/.netlify/functions/send-newsletter \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"newsletter_id": 1}'
```

### Test 3: Scheduled Send
The system checks every hour for scheduled newsletters. To test:
1. Schedule newsletter for current time
2. Wait for next hourly check
3. Check function logs in Netlify

## Troubleshooting

### Common Issues:
1. **Authentication failed** - Check SMTP credentials
2. **Port blocked** - Try port 465 with SMTP_SECURE=true
3. **Rate limiting** - Use SendGrid/Mailgun for better limits
4. **SPF/DKIM not set** - Add DNS records for domain

### Test Without SMTP:
For development, the system will simulate sending. You'll see logs like:
```
Simulating email send: { to: 'test@example.com', subject: '...', htmlLength: 1234 }
```

## Immediate Action Required
**Choose an email service and set environment variables** to enable actual email delivery.

## Fallback Option
If you want to test without setting up SMTP, I can modify the system to:
1. Save newsletters as HTML files
2. You can manually send via Mailchimp/Constant Contact
3. Or use a different email marketing service

Which option would you prefer?