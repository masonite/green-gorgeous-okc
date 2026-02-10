# Brevo (Sendinblue) Email Setup for NiceLawnOKC

## Brevo Credentials Needed

Typical Brevo SMTP credentials look like:
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-brevo-smtp-password
FROM_EMAIL="Nice Lawn OKC <newsletter@nicelawnokc.com>"
```

## How to Find Brevo SMTP Credentials

1. **Login to Brevo dashboard**
2. Go to **SMTP & API** section
3. Find **SMTP credentials** (not API key)
4. You'll need:
   - SMTP server: `smtp-relay.brevo.com`
   - Port: `587` (or `465` for SSL)
   - Login: Your Brevo account email
   - Password: SMTP password (different from login password)

## Updated Email Configuration

I've updated the `send-newsletter.js` to use Brevo SMTP. The system will check for these environment variables in Netlify.

## Steps to Configure:

### 1. Add Environment Variables to Netlify
Go to Netlify Dashboard → Site Settings → Environment Variables:
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-email@domain.com
SMTP_PASS=your-brevo-smtp-password
FROM_EMAIL="Nice Lawn OKC <newsletter@nicelawnokc.com>"
ADMIN_USER=admin
ADMIN_PASS=secure-password-here
```

### 2. Verify Brevo Account
- Ensure your Brevo account is verified
- Check sending limits (free tier: 300 emails/day)
- Verify sender email if required

### 3. Test Email Sending
1. Visit `https://nicelawnokc.com/admin`
2. Login with admin credentials
3. Create test newsletter
4. Send to test email address

## Alternative: Use Brevo API Instead of SMTP

If SMTP doesn't work, we can use Brevo's REST API:
```
BREVO_API_KEY=your-api-key-here
BREVO_SENDER_EMAIL=newsletter@nicelawnokc.com
BREVO_SENDER_NAME="Nice Lawn OKC"
```

## Immediate Test

Once you provide the Brevo credentials, I can:
1. Update the Netlify environment variables
2. Test email sending
3. Send you the first newsletter

## Current Status
- Newsletter HTML ready: `https://nicelawnokc.com/newsletter-february-2026.html`
- Email system configured for Brevo SMTP
- Waiting for credentials to activate

**Please provide the Brevo SMTP credentials or let me know where the `.env.brevo` file is located.**