#!/bin/bash
# Script to update site configuration for nicelawnokc.com
# Run after nicelawnokc.com is purchased and pointing to Netlify

set -e

echo "🔧 Updating site configuration for nicelawnokc.com"

# Update canonical domain in script.js
echo "Updating canonicalDomain in script.js..."
sed -i "s/canonicalDomain: '.*'/canonicalDomain: 'nicelawnokc.com'/" script.js

# Update netlify.toml redirects
echo "Updating netlify.toml configuration..."
sed -i "s/greenandgorgeousokc.com/nicelawnokc.com/g" netlify.toml

# Update all HTML files
echo "Updating HTML files..."
for file in *.html; do
    if [ -f "$file" ]; then
        sed -i "s/greenandgorgeousokc.com/nicelawnokc.com/g" "$file"
        echo "  Updated: $file"
    fi
done

# Create robots.txt for production
echo "Creating robots.txt for production..."
cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Disallow: /admin
Disallow: /.netlify/

Sitemap: https://nicelawnokc.com/sitemap.xml
EOF

# Create sitemap.xml
echo "Creating sitemap.xml..."
cat > sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nicelawnokc.com/</loc>
    <lastmod>2026-02-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nicelawnokc.com/admin</loc>
    <lastmod>2026-02-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
EOF

# Update README with production domain
echo "Updating README.md..."
sed -i "s/greenandgorgeousokc.com/nicelawnokc.com/g" README.md
sed -i "s/Green & Gorgeous OKC/Nice Lawn OKC/g" README.md

# Update site title in index.html
echo "Updating site title..."
sed -i "s/<title>Green & Gorgeous OKC<\/title>/<title>Nice Lawn OKC - Professional Lawn Care Services<\/title>/" index.html
sed -i "s/Green & Gorgeous OKC/Nice Lawn OKC/g" index.html

# Update admin page title
sed -i "s/Green & Gorgeous OKC Admin/Nice Lawn OKC Admin/" admin.html

echo ""
echo "✅ Configuration updates complete for nicelawnokc.com!"
echo ""
echo "Next steps:"
echo "1. Purchase nicelawnokc.com domain"
echo "2. Point DNS to Netlify (CNAME to green-gorgeous-okc.netlify.app)"
echo "3. Update Netlify site settings to use nicelawnokc.com"
echo "4. Commit and push changes:"
echo "   git add . && git commit -m 'Update domain to nicelawnokc.com' && git push"
echo ""
echo "5. Test the site at:"
echo "   - https://nicelawnokc.com"
echo "   - https://nicelawnokc.com/admin"
echo ""
echo "6. Set up Google Analytics (optional)"
echo "7. Submit sitemap to Google Search Console"