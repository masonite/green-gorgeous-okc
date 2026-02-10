#!/bin/bash
# Script to update site configuration after domain purchase
# Run after greenandgorgeousokc.com is purchased and pointing to Netlify

set -e

echo "🔧 Updating site configuration for greenandgorgeousokc.com"

# Update canonical domain in script.js
echo "Updating canonicalDomain in script.js..."
sed -i "s/canonicalDomain: '.*'/canonicalDomain: 'greenandgorgeousokc.com'/" script.js

# Update netlify.toml redirects if domain name differs from expected
echo "Checking netlify.toml configuration..."
if grep -q "greenandgorgeousokc.com" netlify.toml; then
    echo "✓ netlify.toml already configured for greenandgorgeousokc.com"
else
    echo "⚠️  Warning: Domain name mismatch in netlify.toml"
    echo "Please update redirects manually if using different domain"
fi

# Create robots.txt for production
echo "Creating robots.txt for production..."
cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Disallow: /admin
Disallow: /.netlify/

Sitemap: https://greenandgorgeousokc.com/sitemap.xml
EOF

# Create sitemap.xml
echo "Creating sitemap.xml..."
cat > sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://greenandgorgeousokc.com/</loc>
    <lastmod>2026-02-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://greenandgorgeousokc.com/admin</loc>
    <lastmod>2026-02-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
EOF

# Update README with production domain
echo "Updating README.md..."
if grep -q "greenandgorgeousokc.com" README.md; then
    echo "✓ README.md already mentions production domain"
else
    sed -i "s|## Deployment|## Production Deployment\n\n**Live Site:** https://greenandgorgeousokc.com\n\n## Development Deployment|" README.md
fi

echo ""
echo "✅ Configuration updates complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push changes:"
echo "   git add . && git commit -m 'Update for production domain greenandgorgeousokc.com' && git push"
echo ""
echo "2. Test the site at:"
echo "   - https://greenandgorgeousokc.com"
echo "   - https://greenandgorgeousokc.com/admin"
echo ""
echo "3. Set up Google Analytics (optional)"
echo "4. Submit sitemap to Google Search Console"
echo "5. Configure email forwarding if needed"