# EverGreen Gardens Newsletter Template

## Brand Identity
- **Name**: EverGreen Gardens
- **Tagline**: "Transforming outdoor spaces into personal sanctuaries"
- **Primary Color**: #25ec13 (vibrant green)
- **Secondary Colors**: #0f1b0d (leaf), #f8fcf8 (background), #d9c5b2 (wood)
- **Fonts**: Noto Serif (headings), Noto Sans (body)
- **Style**: Modern, organic, premium landscaping aesthetic

## Newsletter Structure

### 1. HEADER SECTION
```html
<!-- EverGreen Gardens Header -->
<div class="text-center mb-12">
    <div class="inline-block p-6 rounded-3xl bg-leaf text-white mb-6">
        <h1 class="text-4xl md:text-5xl font-black font-display mb-2">
            <span class="text-primary">EverGreen</span> Gardens
        </h1>
        <p class="text-lg opacity-90">Professional Landscaping Newsletter</p>
    </div>
    <div class="text-leaf">
        <p class="text-xl font-medium">[Month] [Year] Edition | Oklahoma City</p>
        <p class="text-lg mt-2">Transforming outdoor spaces into personal sanctuaries</p>
    </div>
</div>
```

### 2. HERO SECTION
```html
<!-- Hero with gradient background -->
<section class="mb-16">
    <div class="relative overflow-hidden rounded-3xl bg-leaf min-h-[400px] flex items-center justify-center text-center p-8">
        <div class="absolute inset-0 z-0 opacity-60">
            <div class="h-full w-full bg-gradient-to-br from-primary/20 to-leaf"></div>
        </div>
        <div class="relative z-10 max-w-3xl">
            <h2 class="mb-6 text-3xl font-black text-white md:text-4xl lg:text-5xl leading-tight font-display">
                [Catchy Headline]: <span class="text-primary italic">[Key Benefit]</span>
            </h2>
            <p class="mb-8 text-lg text-white/90 md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                [Brief description of this month's focus]
            </p>
        </div>
    </div>
</section>
```

### 3. FEATURE CARDS TEMPLATE
```html
<!-- Feature Card Structure -->
<div class="feature-card bg-soft-green rounded-2xl p-6">
    <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-2xl text-primary">[icon]</span>
        <h3 class="text-xl font-bold text-leaf">[Feature Title]</h3>
    </div>
    <p class="text-leaf/90 mb-4"><strong>Why:</strong> [Explanation of importance]</p>
    <p class="text-leaf/90"><strong>Action:</strong> [Specific actionable step]</p>
</div>
```

### 4. SERVICE OFFERING TEMPLATE
```html
<!-- Service Offering -->
<div class="bg-primary/10 rounded-2xl p-6 mb-6">
    <h3 class="text-2xl font-bold text-leaf mb-4">[Service Name] Special</h3>
    <p class="text-lg text-leaf/90 mb-6">Exclusive offer for newsletter subscribers only</p>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl p-5">
            <h4 class="font-bold text-leaf mb-3">Services Included:</h4>
            <ul class="space-y-2">
                <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-sm">check</span>
                    [Service 1]
                </li>
                <!-- More services -->
            </ul>
        </div>
        
        <div class="bg-white rounded-xl p-5">
            <h4 class="font-bold text-leaf mb-3">Special Offer:</h4>
            <ul class="space-y-2">
                <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-sm">percent</span>
                    [Discount/Offer 1]
                </li>
                <!-- More offers -->
            </ul>
        </div>
    </div>
</div>
```

### 5. CALL-TO-ACTION TEMPLATE
```html
<!-- CTA Section -->
<div class="text-center">
    <div class="inline-block bg-primary rounded-2xl p-8 max-w-2xl">
        <h3 class="text-2xl font-bold text-leaf mb-4">[CTA Headline]</h3>
        <p class="text-leaf/90 mb-6 text-lg">[Supporting text]</p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button onclick="requestQuote()" class="bg-leaf text-white px-8 py-4 rounded-xl font-bold hover:bg-leaf/90 transition-all text-lg">
                [Primary Action]
            </button>
            <button onclick="viewProviders()" class="bg-white text-leaf border-2 border-leaf px-8 py-4 rounded-xl font-bold hover:bg-leaf/10 transition-all text-lg">
                [Secondary Action]
            </button>
        </div>
    </div>
</div>
```

### 6. Q&A TEMPLATE
```html
<!-- Q&A Item -->
<div class="border-l-4 border-primary pl-6 py-2">
    <h3 class="text-xl font-bold text-leaf mb-3">"[Question]"</h3>
    <p class="text-leaf/90">
        <strong>Answer:</strong> [Detailed, helpful answer]
    </p>
</div>
```

## Content Guidelines

### Monthly Themes
- **February**: Spring Lawn Preparation
- **March**: Weed Control & Fertilization
- **April**: Irrigation System Setup
- **May**: Summer Lawn Maintenance
- **September**: Fall Cleanup & Aeration
- **October**: Winter Preparation

### Writing Style
- **Tone**: Professional yet approachable, educational
- **Voice**: Expert advisor, local Oklahoma focus
- **Length**: 800-1200 words per newsletter
- **Format**: Mix of tips, local insights, and service offers

### Icon Selection (Material Symbols)
- `grass` - Lawn care
- `water_drop` - Irrigation/watering
- `psychiatry` - Weed control
- `yard` - Mowing/maintenance
- `science` - Soil testing
- `local_florist` - Local services
- `contact_support` - Q&A
- `eco` - Sustainability
- `percent` - Discounts
- `check` - Included services

## Google Places API Integration

### API Key Location
The Google Places API key is configured in `~/.clawdbot/clawdbot.json` under the `local-places` skill:

```json
"local-places": {
  "apiKey": "AIzaSyAVHzCYMtKqYIwuJgtbC5oSbKWAV3qCpJs"
}
```

### Using goplaces CLI
The `goplaces` CLI tool is available and can be used to search for local services:

```bash
# Search for lawn services in Oklahoma City
goplaces --api-key="AIzaSyAVHzCYMtKqYIwuJgtbC5oSbKWAV3qCpJs" search "lawn service Oklahoma City" --limit=5 --json

# Search nearby specific location
goplaces --api-key="AIzaSyAVHzCYMtKqYIwuJgtbC5oSbKWAV3qCpJs" nearby --lat=35.4676 --lng=-97.5164 --radius-m=10000 --limit=5 --json
```

### Backend Integration Example
```javascript
// Node.js backend using goplaces CLI
const { exec } = require('child_process');
const path = require('path');

class LocalPlacesService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.goplacesPath = path.join(__dirname, 'node_modules', '.bin', 'goplaces');
  }

  async searchLawnServices(location, limit = 5) {
    return new Promise((resolve, reject) => {
      const command = `"${this.goplacesPath}" --api-key="${this.apiKey}" search "lawn service ${location}" --limit=${limit} --json`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('goplaces error:', stderr);
          reject(error);
          return;
        }
        
        try {
          const results = JSON.parse(stdout);
          // Filter and format results
          const formatted = results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.address,
            rating: place.rating,
            location: place.location,
            types: place.types,
            open_now: place.open_now
          }));
          resolve(formatted);
        } catch (e) {
          reject(new Error(`Failed to parse goplaces output: ${e.message}`));
        }
      });
    });
  }

  async getPlaceDetails(placeId) {
    return new Promise((resolve, reject) => {
      const command = `"${this.goplacesPath}" --api-key="${this.apiKey}" details "${placeId}" --json`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        
        try {
          const details = JSON.parse(stdout);
          resolve(details);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

// Usage
const placesService = new LocalPlacesService(process.env.GOOGLE_PLACES_API_KEY);

// In API endpoint
app.get('/api/local-services', async (req, res) => {
  try {
    const { location = 'Oklahoma City', limit = 5 } = req.query;
    const services = await placesService.searchLawnServices(location, limit);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend Integration
```javascript
// Frontend JavaScript (in newsletter HTML)
async function loadLocalServices() {
  try {
    const response = await fetch('/api/local-services?location=Oklahoma City&limit=4');
    const services = await response.json();
    
    // Display services in newsletter
    displayServices(services);
  } catch (error) {
    console.error('Failed to load local services:', error);
    // Fallback to mock data
    displayServices(getMockServices());
  }
}

function displayServices(services) {
  const container = document.getElementById('local-services-container');
  
  services.forEach(service => {
    const serviceElement = createServiceCard(service);
    container.appendChild(serviceElement);
  });
}

function createServiceCard(service) {
  return `
    <div class="service-card">
      <h3>${service.name}</h3>
      <p class="address">${service.address}</p>
      <div class="rating">Rating: ${service.rating}/5</div>
      <button onclick="requestQuote('${service.id}')">Request Quote</button>
    </div>
  `;
}
```

## Distribution Strategy

### 1. Nextdoor Posts
- Target neighborhoods: Nichols Hills, Edmond, Norman, Moore
- Post frequency: Weekly
- Content: Excerpt from newsletter + link to full version

### 2. Email Newsletter
- Platform: ConvertKit or Substack
- Frequency: Monthly
- Segmentation: By neighborhood/service interest

### 3. Social Media
- Facebook: OKC Homeowners groups
- Instagram: Visual content from featured projects
- LinkedIn: Professional landscaping insights

### 4. Local Partnerships
- Garden centers (Cross-promotion)
- Real estate agents (New homeowner packages)
- Home improvement stores (Co-marketing)

## Monetization Model

### 1. Lead Generation Fees
- **Qualified lead**: $25-50 to service providers
- **Requirements**: Homeowner needs service, budget, timeline
- **Vetting**: Providers must be licensed, insured, reviewed

### 2. Featured Listings
- **Spotlight feature**: $100-300 per newsletter
- **Includes**: Dedicated section, special offer promotion
- **Requirements**: Minimum 4-star rating, local service area

### 3. Affiliate Commissions
- **Product recommendations**: 10-15% commission
- **Equipment rentals**: 5-10% commission
- **Service packages**: 5-15% of contract value

### 4. Premium Subscription
- **Tier**: $9.99/month
- **Benefits**: Priority matching, exclusive discounts, 1-on-1 consultations
- **Target**: High-value homeowners, commercial properties

## Success Metrics

### Month 1 Goals
- **Subscribers**: 100+
- **Open rate**: 80%+
- **Click-through rate**: 15%+
- **Leads generated**: 10+
- **Revenue**: $250+

### Month 3 Goals
- **Subscribers**: 500+
- **Open rate**: 75%+
- **Click-through rate**: 12%+
- **Leads generated**: 50+
- **Revenue**: $1,500+

### Month 6 Goals
- **Subscribers**: 1,000+
- **Open rate**: 70%+
- **Click-through rate**: 10%+
- **Leads generated**: 100+
- **Revenue**: $5,000+

## Implementation Checklist

### Phase 1: Setup (Week 1)
- [ ] Create newsletter HTML template
- [ ] Set up email service (ConvertKit/Substack)
- [ ] Design Nextdoor posting strategy
- [ ] Identify first 5 lawn service partners
- [ ] Create Google Places API integration

### Phase 2: Launch (Week 2)
- [ ] Send first newsletter to 50 beta subscribers
- [ ] Post on Nextdoor in 3 neighborhoods
- [ ] Share in 2 Facebook groups
- [ ] Collect feedback and testimonials
- [ ] Optimize based on engagement

### Phase 3: Scale (Week 3-4)
- [ ] Expand to 5 neighborhoods
- [ ] Add 5 more service partners
- [ ] Implement premium subscription tier
- [ ] Create referral program
- [ ] Track and analyze performance metrics

## Legal & Compliance

### Required Disclosures
- **Affiliate links**: "We may earn commission from recommended products"
- **Sponsored content**: "Featured partner" disclosure
- **Lead fees**: "We receive compensation from service providers"
- **Data privacy**: GDPR/CCPA compliant privacy policy

### Service Provider Agreements
- **Vetting criteria**: License, insurance, reviews
- **Commission structure**: Clear fee schedule
- **Quality guarantee**: Replacement if service unsatisfactory
- **Cancellation policy**: 30-day notice for featured listings

---

**Next Action**: Launch beta newsletter to 50 subscribers and track engagement metrics for optimization.