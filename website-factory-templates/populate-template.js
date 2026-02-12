// Master template population script for Website Factory
const fs = require('fs');
const path = require('path');

// Template definitions
const templates = {
  'freshcut': {
    name: 'FreshCut',
    description: 'Modern, clean lawn care template',
    accent_color: '#10b981'
  },
  'estatelawns': {
    name: 'EstateLawns',
    description: 'Premium, luxury lawn care template',
    accent_color: '#c9a84c'
  },
  'greenmachine': {
    name: 'GreenMachine',
    description: 'Bold, high-energy lawn care template',
    accent_color: '#a3e635'
  },
  'grassroots': {
    name: 'Grassroots',
    description: 'Minimal, earthy lawn care template',
    accent_color: '#5a7a3a'
  },
  'neighborhoodpro': {
    name: 'NeighborhoodPro',
    description: 'Classic, friendly lawn care template',
    accent_color: '#ff6b35'
  }
};

// Sample business data
const sampleBusiness = {
  business_name: "Perfect Lawn Care",
  primary_service: "Professional Lawn Maintenance",
  city: "Your City",
  phone: "(555) 123-4567",
  email: "contact@perfectlawn.com",
  about_text: "Professional lawn care that transforms your outdoor space into a pristine, magazine-worthy landscape."
};

// Function to populate a template
function populateTemplate(templateId, businessData) {
  const templateDir = path.join(__dirname, 'templates');
  const htmlFile = path.join(templateDir, 'html', `${templateId}.html`);
  const cssFile = path.join(templateDir, 'css', `${templateId}.css`);
  const configFile = path.join(templateDir, 'configs', `${templateId}.json`);
  
  // Read template HTML
  let html = fs.readFileSync(htmlFile, 'utf8');
  
  // Replace all tags with business data
  html = html.replace(/{{BUSINESS_NAME}}/g, businessData.business_name);
  html = html.replace(/{{PRIMARY_SERVICE}}/g, businessData.primary_service);
  html = html.replace(/{{CITY}}/g, businessData.city);
  html = html.replace(/{{PHONE}}/g, businessData.phone);
  html = html.replace(/{{EMAIL}}/g, businessData.email);
  
  // Read config to understand template structure
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  
  return {
    html,
    css: fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : null,
    config,
    templateInfo: templates[templateId]
  };
}

// Function to generate all templates for a business
function generateAllTemplates(businessData, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const results = {};
  
  for (const [templateId, templateInfo] of Object.entries(templates)) {
    console.log(`🔄 Generating ${templateInfo.name} template...`);
    
    const result = populateTemplate(templateId, businessData);
    
    // Create template directory
    const templateOutputDir = path.join(outputDir, templateId);
    if (!fs.existsSync(templateOutputDir)) {
      fs.mkdirSync(templateOutputDir, { recursive: true });
    }
    
    // Write HTML file
    const htmlOutputPath = path.join(templateOutputDir, 'index.html');
    fs.writeFileSync(htmlOutputPath, result.html);
    
    // Write CSS file if exists
    if (result.css) {
      const cssOutputPath = path.join(templateOutputDir, 'style.css');
      fs.writeFileSync(cssOutputPath, result.css);
    }
    
    // Save config
    const configOutputPath = path.join(templateOutputDir, 'config.json');
    fs.writeFileSync(configOutputPath, JSON.stringify(result.config, null, 2));
    
    results[templateId] = {
      outputDir: templateOutputDir,
      htmlFile: htmlOutputPath,
      cssFile: result.css ? path.join(templateOutputDir, 'style.css') : null,
      config: result.config,
      templateInfo: templateInfo
    };
    
    console.log(`✅ ${templateInfo.name} generated at: ${templateOutputDir}`);
  }
  
  return results;
}

// Function to create demo portal
function createDemoPortal(businessData, templatesOutput, outputDir) {
  const portalDir = path.join(outputDir, 'demo-portal');
  if (!fs.existsSync(portalDir)) {
    fs.mkdirSync(portalDir, { recursive: true });
  }
  
  // Create index.html for demo portal
  let portalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Factory Demo - ${businessData.business_name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #e2e8f0;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: #0f172a;
        }
        
        .subtitle {
            color: #64748b;
            font-size: 1.125rem;
            margin-bottom: 1.5rem;
        }
        
        .business-info {
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }
        
        .business-info h2 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: #0f172a;
        }
        
        .business-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .detail-item {
            padding: 0.75rem;
            background: #f8fafc;
            border-radius: 0.5rem;
        }
        
        .detail-label {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 0.25rem;
        }
        
        .detail-value {
            font-weight: 600;
            color: #0f172a;
        }
        
        .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .template-card {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .template-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        
        .template-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .template-name {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .template-accent {
            width: 1rem;
            height: 1rem;
            border-radius: 9999px;
            display: inline-block;
        }
        
        .template-description {
            color: #64748b;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        
        .template-preview {
            height: 200px;
            overflow: hidden;
            position: relative;
        }
        
        .template-preview iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .template-actions {
            padding: 1rem 1.5rem;
            display: flex;
            gap: 0.75rem;
            border-top: 1px solid #e2e8f0;
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 0.875rem;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
        }
        
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2563eb;
        }
        
        .btn-secondary {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
        }
        
        .btn-secondary:hover {
            background: #e2e8f0;
        }
        
        .success-banner {
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
            text-align: center;
            font-weight: 600;
        }
        
        footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .templates-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
</head>
<body>
    <div class="container">
        <header>
            <h1>Website Factory Demo</h1>
            <p class="subtitle">5 Professional Lawn Care Templates - Same Business, Different Styles</p>
            
            <div class="success-banner">
                <i data-lucide="check-circle" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;"></i>
                All 5 templates successfully generated with your business data!
            </div>
        </header>
        
        <div class="business-info">
            <h2>Business Information Used</h2>
            <div class="business-details">
                <div class="detail-item">
                    <div class="detail-label">Business Name</div>
                    <div class="detail-value">${businessData.business_name}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Primary Service</div>
                    <div class="detail-value">${businessData.primary_service}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">City</div>
                    <div class="detail-value">${businessData.city}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value">${businessData.phone}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${businessData.email}</div>
                </div>
            </div>
        </div>
        
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #0f172a;">Available Templates</h2>
        <p style="color: #64748b; margin-bottom: 2rem;">Click "View Live" to see each template with your business data.</p>
        
        <div class="templates-grid">
  `;
  
  // Add template cards
  for (const [templateId, templateData] of Object.entries(templatesOutput)) {
    const templateInfo = templates[templateId];
    const templatePath = path.relative(portalDir, templateData.outputDir);
    
    portalHtml += `
            <div class="template-card">
                <div class="template-header">
                    <div class="template-name">
                        <span class="template-accent" style="background: ${templateInfo.accent_color}"></span>
                        ${templateInfo.name}
                    </div>
                    <div class="template-description">${templateInfo.description}</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">
                        <i data-lucide="palette" style="width: 0.875rem; height: 0.875rem; margin-right: 0.25rem;"></i>
                        Accent: <span style="color: ${templateInfo.accent_color}; font-weight: 600;">${templateInfo.accent_color}</span>
                    </div>
                </div>
                <div class="template-preview">
                    <iframe src="${templatePath}/index.html" title="${templateInfo.name} Preview"></iframe>
                </div>
                <div class="template-actions">
                    <a href="${templatePath}/index.html" target="_blank" class="btn btn-primary">
                        <i data-lucide="eye" style="width: 1rem; height: 1rem;"></i>
                        View Live
                    </a>
                    <a href="${templatePath}/style.css" target="_blank" class="btn btn-secondary">
                        <i data-lucide="code" style="width: 1rem; height: 1rem;"></i>
                        View CSS
                    </a>
                </div>
            </div>
    `;
  }
  
  portalHtml += `
        </div>
        
        <footer>
            <p>Website Factory System • Generated on ${new Date().toLocaleDateString()}</p>
            <p style="margin-top: 0.5rem; font-size: 0.75rem; color: #94a3b8;">
                All templates use the same business data with different visual styles.
            </p>
        </footer>
    </div>
    
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(portalDir, 'index.html'), portalHtml);
  console.log(`🎯 Demo portal created at: ${portalDir}/index.html`);
  
  return portalDir;
}

// Main execution
if (require.main === module) {
  const outputDir = path.join(__dirname, 'generated-websites');
  
  console.log('🚀 Starting Website Factory Template Generation...');
  console.log('📊 Business Data:', JSON.stringify(sampleBusiness, null, 2));
  
  // Generate all templates
  const results = generateAllTemplates(sampleBusiness, outputDir);
  
  // Create demo portal
  const portalDir = createDemoPortal(sampleBusiness, results, outputDir);
  
  console.log('\n🎉 WEBSITE FACTORY GENERATION COMPLETE!');
  console.log('========================================');
  console.log(`📁 All templates saved to: ${outputDir}`);
  console.log(`🌐 Demo portal: ${portalDir}/index.html`);
  console.log('\n📋 Generated Templates:');
  for (const [templateId, templateData] of Object.entries(results)) {
    console.log(`   • ${templateData.templateInfo.name}: ${templateData.outputDir}`);
  }
  console.log('\n🚀 Next Steps:');
  console.log('   1. Open demo portal to see all templates');
  console.log('   2. Customize business data for real clients');
  console.log('   3. Deploy templates to hosting (Netlify/Vercel)');
  console.log('   4. Start selling websites!');
}

module.exports = {
  populateTemplate,
  generateAllTemplates,
  createDemoPortal,
  templates,
  sampleBusiness
};