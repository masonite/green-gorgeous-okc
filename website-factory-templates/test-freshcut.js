// Test script for FreshCut template population
const fs = require('fs');
const path = require('path');

// Sample business data
const sampleBusiness = {
  business_name: "GreenThumb Lawn Care",
  primary_service: "Lawn Maintenance",
  city: "Oklahoma City",
  phone: "(405) 555-0123",
  email: "info@greenthumbokc.com",
  about_text: "Professional lawn care that transforms your outdoor space into a pristine, magazine-worthy landscape.",
  services: [
    { name: "Lawn Mowing", description: "Weekly and bi-weekly mowing with precision cutting patterns." },
    { name: "Irrigation", description: "Smart sprinkler systems designed for optimal water usage." },
    { name: "Fertilization", description: "Seasonal treatments to keep your grass thick and green." }
  ]
};

// Read the FreshCut template
const templatePath = path.join(__dirname, 'templates/html/freshcut.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Replace tags with sample data
template = template.replace(/{{BUSINESS_NAME}}/g, sampleBusiness.business_name);
template = template.replace(/{{PRIMARY_SERVICE}}/g, sampleBusiness.primary_service);
template = template.replace(/{{CITY}}/g, sampleBusiness.city);
template = template.replace(/{{PHONE}}/g, sampleBusiness.phone);
template = template.replace(/{{EMAIL}}/g, sampleBusiness.email);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'test-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the populated template
const outputPath = path.join(outputDir, 'freshcut-populated.html');
fs.writeFileSync(outputPath, template);

// Copy CSS file
const cssSource = path.join(__dirname, 'templates/css/freshcut.css');
const cssDest = path.join(outputDir, 'freshcut.css');
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, cssDest);
}

console.log('✅ FreshCut template populated successfully!');
console.log(`📁 Output saved to: ${outputPath}`);
console.log(`🌐 Open ${outputPath} in a browser to view the result.`);

// Create a simple HTML file to view the result
const viewerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreshCut Template Test - ${sampleBusiness.business_name}</title>
    <link rel="stylesheet" href="freshcut.css">
    <style>
        body { font-family: sans-serif; padding: 2rem; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #10b981; margin-bottom: 1rem; }
        .success { color: #10b981; font-weight: bold; }
        .info { color: #6b7280; margin-bottom: 1rem; }
        iframe { width: 100%; height: 600px; border: 2px solid #e5e7eb; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>FreshCut Template Test</h1>
            <p class="info">Business: <strong>${sampleBusiness.business_name}</strong></p>
            <p class="info">Service: ${sampleBusiness.primary_service} in ${sampleBusiness.city}</p>
            <p class="success">✅ Template successfully populated with sample data!</p>
        </div>
        
        <div class="card">
            <h2>Preview:</h2>
            <iframe src="freshcut-populated.html" title="FreshCut Template Preview"></iframe>
            <p style="margin-top: 1rem;">
                <a href="freshcut-populated.html" target="_blank">Open in new tab</a> | 
                <a href="freshcut.css" target="_blank">View CSS</a>
            </p>
        </div>
        
        <div class="card">
            <h2>Sample Data Used:</h2>
            <pre style="background: #f9fafb; padding: 1rem; border-radius: 4px; overflow: auto;">
${JSON.stringify(sampleBusiness, null, 2)}
            </pre>
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(outputDir, 'index.html'), viewerHtml);
console.log('📊 Test viewer created at test-output/index.html');