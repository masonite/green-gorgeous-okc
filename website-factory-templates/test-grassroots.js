// Test script for Grassroots template population
const fs = require('fs');
const path = require('path');

// Sample business data for eco-friendly service
const sampleBusiness = {
  business_name: "Earthwise Lawn Care",
  primary_service: "Organic Lawn Maintenance",
  city: "Portland",
  phone: "(503) 555-0123",
  email: "hello@earthwiselawn.com",
  about_text: "We believe in nurturing your lawn with organic methods and earth-friendly practices. Beautiful results, naturally.",
  values: [
    { name: "Locally Owned", description: "Family-run business serving our community since 2008." },
    { name: "Eco-Friendly", description: "All-natural fertilizers and sustainable lawn care methods." },
    { name: "Reliable Service", description: "Show up on time, every time. That's our promise." }
  ]
};

// Read the Grassroots template
const templatePath = path.join(__dirname, 'templates/html/grassroots.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Replace tags with sample data
template = template.replace(/{{BUSINESS_NAME}}/g, sampleBusiness.business_name);
template = template.replace(/{{PRIMARY_SERVICE}}/g, sampleBusiness.primary_service);
template = template.replace(/{{CITY}}/g, sampleBusiness.city);
template = template.replace(/{{PHONE}}/g, sampleBusiness.phone);
template = template.replace(/{{EMAIL}}/g, sampleBusiness.email);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'test-output-grassroots');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the populated template
const outputPath = path.join(outputDir, 'grassroots-populated.html');
fs.writeFileSync(outputPath, template);

// Copy CSS file
const cssSource = path.join(__dirname, 'templates/css/grassroots.css');
const cssDest = path.join(outputDir, 'grassroots.css');
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, cssDest);
}

console.log('✅ Grassroots template populated successfully!');
console.log(`📁 Output saved to: ${outputPath}`);
console.log(`🌐 Open ${outputPath} in a browser to view the result.`);

// Create a simple HTML file to view the result
const viewerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grassroots Template Test - ${sampleBusiness.business_name}</title>
    <link rel="stylesheet" href="grassroots.css">
    <style>
        body { font-family: sans-serif; padding: 2rem; background: #faf8f4; color: #3d3428; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; border: 1px solid #e8e3d9; }
        h1 { color: #5a7a3a; margin-bottom: 1rem; }
        .success { color: #5a7a3a; font-weight: bold; }
        .info { color: #8a7e6e; margin-bottom: 1rem; }
        iframe { width: 100%; height: 600px; border: 2px solid #e8e3d9; border-radius: 8px; background: white; }
        a { color: #5a7a3a; }
        pre { background: #f5f2eb; padding: 1rem; border-radius: 4px; overflow: auto; color: #8a7e6e; border: 1px solid #e8e3d9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Grassroots Template Test</h1>
            <p class="info">Business: <strong>${sampleBusiness.business_name}</strong></p>
            <p class="info">Service: ${sampleBusiness.primary_service} in ${sampleBusiness.city}</p>
            <p class="success">✅ Template successfully populated with sample data!</p>
        </div>
        
        <div class="card">
            <h2>Preview:</h2>
            <iframe src="grassroots-populated.html" title="Grassroots Template Preview"></iframe>
            <p style="margin-top: 1rem;">
                <a href="grassroots-populated.html" target="_blank">Open in new tab</a> | 
                <a href="grassroots.css" target="_blank">View CSS</a>
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
console.log('📊 Test viewer created at test-output-grassroots/index.html');