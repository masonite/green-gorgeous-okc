# Nice Lawn OKC - Newsletter Landing Page

Lead generation landing page for the "Nice Lawn OKC" lawn care newsletter. Captures email + ZIP code from Oklahoma City homeowners, generating qualified leads to sell to local lawn service companies.

## Quick Start

No build step. Open `index.html` in a browser or serve with any static server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Complete landing page (hero, features, preview, testimonials, CTA) |
| `styles.css` | All styling, responsive down to 380px |
| `script.js` | Form validation, scroll animations, localStorage backup, analytics hooks |

## Connecting a Backend

The form submission in `script.js` is currently simulated. To connect a real backend, edit the `submitForm()` function (~line 177). Supported integration examples are commented in the code:

- **Mailchimp / ConvertKit** -- POST to your API endpoint
- **Google Sheets** -- via Apps Script web app
- **Formspree** -- zero-backend option at `formspree.io`

Signups are also saved to `localStorage` as a backup. Export them from the browser console:

```js
GG_OKC.exportSignups()  // returns array of all signups
GG_OKC.clearSignups()   // clears stored signups
```

## Analytics

The `trackEvent()` function (~line 321) is an integration point for:
- Google Analytics 4 (`gtag`)
- Facebook Pixel (`fbq`)
- Custom tracking endpoints

Currently logs to console. Uncomment your platform's code in that function.

## Form Validation

- **Email**: Standard format validation
- **ZIP Code**: Must be 5 digits starting with `73` or `74` (Oklahoma)
- Real-time validation on blur, error clearing on input

## Design Specs

- **Colors**: Deep forest green `#2D5016`, spring green `#7CB342`, golden yellow `#FFC107`
- **Fonts**: Poppins (headings), Open Sans (body) via Google Fonts
- **Responsive**: Desktop → Tablet (992px) → Mobile (640px) → Small (380px)

## Backend Functions & Database

This project now includes serverless backend functionality:

### Netlify Functions
- **`/.netlify/functions/subscribe`** - Handles newsletter signups, stores in SQLite database
- **`/.netlify/functions/admin-signups`** - Admin endpoint to view signups (Basic auth protected)

### Database
- **SQLite database** stored in `/tmp/newsletter_db/signups.db`
- Tables: `signups`, `newsletter_logs`
- Persists between function executions on Netlify

### Admin Dashboard
- **URL:** `/admin` or `/admin.html`
- **Default credentials:** `admin` / `test123`
- **Features:** View all signups, statistics, ZIP code distribution, pagination

### Environment Variables (for production)
```bash
ADMIN_USER=your_secure_username
ADMIN_PASS=your_secure_password
```

## Production Deployment

**Live Site:** https://nicelawnokc.com

## Development Deployment

### Netlify (Recommended)
- Auto-deploys from GitHub
- Functions automatically built and deployed
- Database persists in function execution environment

### Local Development
```bash
# Install dependencies
npm install

# Test functions locally (requires Netlify CLI)
netlify dev
```

### Static Hosting Alternatives
- **GitHub Pages**: Push to `gh-pages` branch (frontend only, no functions)
- **Vercel**: `vercel --prod` (similar function support)
- **S3 + CloudFront**: Upload to bucket, enable static hosting (frontend only)

## Revenue Model

1. Capture email + ZIP from OKC homeowners via this landing page
2. Send monthly lawn care newsletter with local, seasonal content
3. Sell qualified leads (email + location) to lawn service providers
4. Connect subscribers with vetted professionals (referral fees)
