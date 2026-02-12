// Test script for EstateLawns template population
const fs = require('fs');
const path = require('path');

// Sample business data for premium service
const sampleBusiness = {
  business_name: "Royal Grounds Management",
  primary_service: "Estate Lawn Care",
  city: "Beverly Hills",
  phone: "(310) 555-0123",
  email: "consultation@royalgrounds.com",
  about_text: "Bespoke landscape management for distinguished properties. Where craftsmanship meets the extraordinary.",
  services: [
    { name: "Grounds Management", description: "Full-service maintenance for expansive estate properties with dedicated crews." },
    { name: "Garden Design", description: "Curated botanical installations that complement your estate's architecture." },
    { name: "Seasonal Programs", description: "Year-round care plans tailored to your property's unique microclimate." }
  ]
};

// Read the EstateLawns template
const templatePath = path.join(__dirname, 'templates/html/estatelawns.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Replace tags with sample data
template = template.replace(/{{BUSINESS_NAME}}/g, sampleBusiness.business_name);
template = template.replace(/{{PRIMARY_SERVICE}}/g, sampleBusiness.primary_service);
template = template.replace(/{{CITY}}/g, sampleBusiness.city);
template = template.replace(/{{PHONE}}/g, sampleBusiness.phone);
template = template.replace(/{{EMAIL}}/g, sampleBusiness.email);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'test-output-estate');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the populated template
const outputPath = path.join(outputDir, 'estatelawns-populated.html');
fs.writeFileSync(outputPath, template);

// Copy CSS file
const cssSource = path.join(__dirname, 'templates/css/estatelawns.css');
const cssDest = path.join(outputDir, 'estatelawns.css');
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, cssDest);
}

console.log('✅ EstateLawns template populated successfully!');
console.log(`📁 Output saved to: ${outputPath}`);
console.log(`🌐 Open ${outputPath} in a browser to view the result.`);

// Create a simple HTML file to view the result
const viewerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EstateLawns Template Test - ${sampleBusiness.business_name}</title>
    <link rel="stylesheet" href="estatelawns.css">
    <style>
        body { font-family: sans-serif; padding: 2rem; background: #0c0b09; color: white; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: #14130f; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; border: 1px solid #2a2720; }
        h1 { color: #c9a84c; margin-bottom: 1rem; }
        .success { color: #c9a84c; font-weight: bold; }
        .info { color: #8a8275; margin-bottom: 1rem; }
        iframe { width: 100%; height: 600px; border: 2px solid #2a2720; border-radius: 8px; background: white; }
        a { color: #c9a84c; }
        pre { background: #0c0b09; padding: 1rem; border-radius: 4px; overflow: auto; color: #8a8275; border: 1px solid #2a2720; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>EstateLawns Template Test</h1>
            <p class="info">Business: <strong>${sampleBusiness.business_name}</strong></p>
            <p class="info">Service: ${sampleBusiness.primary_service} in ${sampleBusiness.city}</p>
            <p class="success">✅ Template successfully populated with sample data!</p>
        </div>
        
        <div class="card">
            <h2>Preview:</h2>
            <iframe src="estatelawns-populated.html" title="EstateLawns Template Preview"></iframe>
            <p style="margin-top: 1rem;">
                <a href="estatelawns-populated.html" target="_blank">Open in new tab</a> | 
                <a href="estatelawns.css" target="_blank">View CSS</a>
            </p>
        </div>
        
        <div class="card">
            <h2>Sample Data Used:</h2>
            <pre>
${JSON.stringify(sampleBusiness, null, 2)}
            </pre>
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(outputDir, 'index.html'), viewerHtml);
console.log('📊 Test viewer created at test-output-estate/index.html');