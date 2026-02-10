# Domain Setup Guide for Green & Gorgeous OKC

## Recommended Domain
**Primary:** `greenandgorgeousokc.com`
- Exact business name match
- Professional, memorable
- Good for local SEO (contains "OKC")
- .com extension (most trusted)

**Alternatives (if primary unavailable):**
- `greenokc.com`
- `okclawncare.com` 
- `gorgeousoklawns.com`

## Purchase Steps (Netlify)

1. **Go to Netlify Domain Search:**
   - https://app.netlify.com/domains
   - Or: Site dashboard → Domain settings → "Add custom domain"

2. **Search & Purchase:**
   - Enter `greenandgorgeousokc.com`
   - Check availability and price (~$12-20/year for .com)
   - Complete purchase (credit card)

3. **Auto-Configuration:**
   - Netlify automatically:
     - Sets up DNS records
     - Configures SSL certificate (free HTTPS)
     - Points domain to your site

4. **Propagation:**
   - DNS changes take 1-48 hours
   - Site remains accessible at both URLs during transition

## Post-Purchase Steps

### 1. Update Site Configuration
- Update `canonicalDomain` in `script.js` line 12
- Update redirects in `netlify.toml` if domain name differs

### 2. Configure Email (Optional)
- Set up email forwarding: `info@greenandgorgeousokc.com` → your email
- Consider professional email: `you@greenandgorgeousokc.com` (via Google Workspace, etc.)

### 3. Update Marketing Materials
- Update business cards, social media profiles
- Update any printed materials with new domain

### 4. SEO Considerations
- Submit sitemap to Google Search Console
- Set up Google Analytics with new domain
- Update any local business listings

## Technical Details

### DNS Configuration (Auto by Netlify)
```
greenandgorgeousokc.com → Netlify CDN
www.greenandgorgeousokc.com → Redirect to non-www
```

### SSL Certificate
- Auto-provisioned by Let's Encrypt
- Auto-renewed by Netlify
- HTTPS enforced for all traffic

### Redirect Rules (Configured in netlify.toml)
- HTTP → HTTPS (301 redirect)
- www → non-www (301 redirect)
- `/admin` → `/admin.html` (200 rewrite)

## Testing After Setup

1. **Check DNS propagation:** https://dnschecker.org
2. **Test HTTPS:** https://greenandgorgeousokc.com
3. **Test redirects:** http://www.greenandgorgeousokc.com
4. **Test admin:** https://greenandgorgeousokc.com/admin
5. **Test form submission:** Full flow with new domain

## Support
- Netlify support: https://www.netlify.com/support/
- Domain management: Netlify dashboard → Domains
- SSL issues: Netlify automatically handles certificates

## Notes
- Domain registration through Netlify's partner (Name.com)
- Auto-renewal recommended to avoid domain loss
- Consider privacy protection for WHOIS records
- Keep domain and Netlify account secure with 2FA