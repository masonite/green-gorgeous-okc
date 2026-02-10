#!/bin/bash
# Test script to verify domain setup after purchase

DOMAIN="greenandgorgeousokc.com"
echo "🔍 Testing domain: $DOMAIN"
echo ""

# Test 1: DNS resolution
echo "1. Testing DNS resolution..."
if dig $DOMAIN +short | grep -q "."; then
    echo "   ✅ DNS resolves: $(dig $DOMAIN +short | head -1)"
else
    echo "   ❌ DNS not resolving yet (may need to wait for propagation)"
fi

# Test 2: HTTP redirect to HTTPS
echo ""
echo "2. Testing HTTP → HTTPS redirect..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "   ✅ HTTP redirects to HTTPS (status: $HTTP_STATUS)"
elif [ "$HTTP_STATUS" = "200" ]; then
    echo "   ⚠️  HTTP returns 200 (should redirect to HTTPS)"
else
    echo "   ❌ HTTP returns: $HTTP_STATUS"
fi

# Test 3: HTTPS accessibility
echo ""
echo "3. Testing HTTPS access..."
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
if [ "$HTTPS_STATUS" = "200" ]; then
    echo "   ✅ HTTPS accessible (status: $HTTPS_STATUS)"
    
    # Check if it's our site
    TITLE=$(curl -s https://$DOMAIN | grep -o '<title>[^<]*</title>' | sed 's/<title>//;s/<\/title>//')
    if echo "$TITLE" | grep -q "Green & Gorgeous"; then
        echo "   ✅ Correct site: $TITLE"
    else
        echo "   ⚠️  Different site title: $TITLE"
    fi
else
    echo "   ❌ HTTPS returns: $HTTPS_STATUS"
fi

# Test 4: www redirect
echo ""
echo "4. Testing www redirect..."
WWW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.$DOMAIN)
if [ "$WWW_STATUS" = "301" ] || [ "$WWW_STATUS" = "302" ]; then
    echo "   ✅ www redirects to non-www (status: $WWW_STATUS)"
elif [ "$WWW_STATUS" = "200" ]; then
    echo "   ⚠️  www returns 200 (should redirect to non-www)"
else
    echo "   ❌ www returns: $WWW_STATUS"
fi

# Test 5: SSL certificate
echo ""
echo "5. Testing SSL certificate..."
if openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
    echo "   ✅ SSL certificate present"
else
    echo "   ❌ SSL certificate issue"
fi

# Test 6: Admin page
echo ""
echo "6. Testing admin page..."
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/admin)
if [ "$ADMIN_STATUS" = "200" ] || [ "$ADMIN_STATUS" = "401" ]; then
    echo "   ✅ Admin page accessible (status: $ADMIN_STATUS)"
else
    echo "   ❌ Admin page returns: $ADMIN_STATUS"
fi

echo ""
echo "📊 Summary:"
echo "Domain should be fully functional when:"
echo "1. ✅ DNS resolves"
echo "2. ✅ HTTP → HTTPS redirect works"
echo "3. ✅ HTTPS returns 200 with correct site"
echo "4. ✅ www → non-www redirect works"
echo "5. ✅ SSL certificate valid"
echo ""
echo "Note: DNS propagation can take 1-48 hours after purchase."
echo "If tests fail initially, wait and try again later."