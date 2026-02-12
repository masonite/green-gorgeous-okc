// Test script for GreenMachine template population
const fs = require('fs');
const path = require('path');

// Sample business data for bold, performance-focused service
const sampleBusiness = {
  business_name: "Turf Titans",
  primary_service: "Premium Lawn Care",
  city: "Austin",
  phone: "(512) 555-0123",
  email: "power@turftitans.com",
  about_text: "Commercial-grade equipment. Cutting-edge techniques. Results that dominate.",
  features: [
    { name: "Fast Turnaround", description: "Same-week service, every time. We don't waste your time." },
    { name: "Guaranteed Results", description: "Not satisfied? We come back and make it right—free." },
    { name: "Award Winning", description: "Voted #1 lawn service 3 years running by local press." }
  ]
};

// Read the GreenMachine template
const templatePath = path.join(__dirname, 'templates/html/greenmachine.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Replace tags with sample data
template = template.replace(/{{BUSINESS_NAME}}/g, sampleBusiness.business_name);
template = template.replace(/{{PRIMARY_SERVICE}}/g, sampleBusiness.primary_service);
template = template.replace(/{{CITY}}/g, sampleBusiness.city);
template = template.replace(/{{PHONE}}/g, sampleBusiness.phone);
template = template.replace(/{{EMAIL}}/g, sampleBusiness.email);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'test-output-green');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the populated template
const outputPath = path.join(outputDir, 'greenmachine-populated.html');
fs.writeFileSync(outputPath, template);

// Copy CSS file
const cssSource = path.join(__dirname, 'templates/css/greenmachine.css');
const cssDest = path.join(outputDir, 'greenmachine.css');
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, cssDest);
}

console.log('✅ GreenMachine template populated successfully!');
console.log(`📁 Output saved to: ${outputPath}`);
console.log(`🌐 Open ${outputPath} in a browser to view the result.`);

// Create a simple HTML file to view the result
const viewerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GreenMachine Template Test - ${sampleBusiness.business_name}</title>
    <link rel="stylesheet" href="greenmachine.css">
    <style>
        body { font-family: sans-serif; padding: 2rem; background: black; color: white; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: #18181b; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; border: 1px solid #27272a; }
        h1 { color: #a3e635; margin-bottom: 1rem; }
        .success { color: #a3e635; font-weight: bold; }
        .info { color: #a1a1aa; margin-bottom: 1rem; }
        iframe { width: 100%; height: 600px; border: 2px solid #27272a; border-radius: 8px; background: white; }
        a { color: #a3e635; }
        pre { background: #09090b; padding: 1rem; border-radius: 4px; overflow: auto; color: #a1a1aa; border: 1px solid #27272a; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>GreenMachine Template Test</h1>
            <p class="info">Business: <strong>${sampleBusiness.business_name}</strong></p>
            <p class="info">Service: ${sampleBusiness.primary_service} in ${sampleBusiness.city}</p>
            <p class="success">✅ Template successfully populated with sample data!</p>
        </div>
        
        <div class="card">
            <h2>Preview:</h2>
            <iframe src="greenmachine-populated.html" title="GreenMachine Template Preview"></iframe>
            <p style="margin-top: 1rem;">
                <a href="greenmachine-populated.html" target="_blank">Open in new tab</a> | 
                <a href="greenmachine.css" target="_blank">View CSS</a>
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
console.log('📊 Test viewer created at test-output-green/index.html');