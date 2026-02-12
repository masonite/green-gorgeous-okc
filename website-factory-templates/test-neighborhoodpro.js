// Test script for NeighborhoodPro template population
const fs = require('fs');
const path = require('path');

// Sample business data for community-focused service
const sampleBusiness = {
  business_name: "Friendly Lawn Pros",
  primary_service: "Neighborhood Lawn Care",
  city: "Charlotte",
  phone: "(704) 555-0123",
  email: "hello@friendlylawnpros.com",
  about_text: "Friendly, reliable, affordable lawn care. We treat every yard like our own backyard.",
  values: [
    { name: "Honest Pricing", description: "What we quote is what you pay. No surprise fees, ever.", color: "#00b894" },
    { name: "Family Owned", description: "Run by the Johnsons since 2012. We know this community.", color: "#ff6b35" },
    { name: "Kid & Pet Safe", description: "All products are family-friendly and pet-safe. Promise!", color: "#e84393" }
  ]
};

// Read the NeighborhoodPro template
const templatePath = path.join(__dirname, 'templates/html/neighborhoodpro.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Replace tags with sample data
template = template.replace(/{{BUSINESS_NAME}}/g, sampleBusiness.business_name);
template = template.replace(/{{PRIMARY_SERVICE}}/g, sampleBusiness.primary_service);
template = template.replace(/{{CITY}}/g, sampleBusiness.city);
template = template.replace(/{{PHONE}}/g, sampleBusiness.phone);
template = template.replace(/{{EMAIL}}/g, sampleBusiness.email);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'test-output-neighborhood');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the populated template
const outputPath = path.join(outputDir, 'neighborhoodpro-populated.html');
fs.writeFileSync(outputPath, template);

// Copy CSS file
const cssSource = path.join(__dirname, 'templates/css/neighborhoodpro.css');
const cssDest = path.join(outputDir, 'neighborhoodpro.css');
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, cssDest);
}

console.log('✅ NeighborhoodPro template populated successfully!');
console.log(`📁 Output saved to: ${outputPath}`);
console.log(`🌐 Open ${outputPath} in a browser to view the result.`);

// Create a simple HTML file to view the result
const viewerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeighborhoodPro Template Test - ${sampleBusiness.business_name}</title>
    <link rel="stylesheet" href="neighborhoodpro.css">
    <style>
        body { font-family: sans-serif; padding: 2rem; background: white; color: #2d3436; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; border: 1px solid #dfe6e9; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        h1 { color: #ff6b35; margin-bottom: 1rem; }
        .success { color: #ff6b35; font-weight: bold; }
        .info { color: #636e72; margin-bottom: 1rem; }
        iframe { width: 100%; height: 600px; border: 2px solid #dfe6e9; border-radius: 8px; background: white; }
        a { color: #ff6b35; }
        pre { background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow: auto; color: #636e72; border: 1px solid #dfe6e9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>NeighborhoodPro Template Test</h1>
            <p class="info">Business: <strong>${sampleBusiness.business_name}</strong></p>
            <p class="info">Service: ${sampleBusiness.primary_service} in ${sampleBusiness.city}</p>
            <p class="success">✅ Template successfully populated with sample data!</p>
        </div>
        
        <div class="card">
            <h2>Preview:</h2>
            <iframe src="neighborhoodpro-populated.html" title="NeighborhoodPro Template Preview"></iframe>
            <p style="margin-top: 1rem;">
                <a href="neighborhoodpro-populated.html" target="_blank">Open in new tab</a> | 
                <a href="neighborhoodpro.css" target="_blank">View CSS</a>
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
console.log('📊 Test viewer created at test-output-neighborhood/index.html');