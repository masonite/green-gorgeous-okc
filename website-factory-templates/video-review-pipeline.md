# Personalized Website Review Video Pipeline

## **OVERVIEW**
Automated system to create personalized video reviews of contractor websites for lead generation.

## **WORKFLOW**

### **Step 1: Lead Input**
```
Input: Contractor business name + website URL
Output: Website screenshots + analysis data
```

### **Step 2: Automated Analysis**
```
1. Screenshot capture (homepage + key pages)
2. Mobile responsiveness test
3. Page speed analysis
4. SEO check (basic)
5. Design assessment
```

### **Step 3: Video Generation**
```
1. Screen recording of current site
2. AI voiceover analyzing issues
3. Side-by-side comparison with our template
4. Call-to-action overlay
```

### **Step 4: Delivery**
```
1. Upload to private video hosting
2. Generate personalized email with video link
3. Track views/engagement
```

## **TECH STACK OPTIONS**

### **Option A: n8n Automation**
```
1. HTTP Request node → Capture website
2. Puppeteer node → Screenshots
3. OpenAI node → Analysis text
4. TTS node → Voiceover
5. FFmpeg node → Video assembly
6. Email node → Send to lead
```

### **Option B: Custom Script**
```javascript
// Pseudo-code
const reviewPipeline = async (url, businessName) => {
  // 1. Capture screenshots
  const screenshots = await captureWebsite(url);
  
  // 2. Analyze issues
  const analysis = await analyzeWebsite(screenshots);
  
  // 3. Generate script
  const script = generatePersonalizedScript(businessName, analysis);
  
  // 4. Create video
  const video = await assembleVideo(screenshots, script);
  
  // 5. Deliver
  await sendToLead(businessName, video);
};
```

### **Option C: Hybrid (n8n + APIs)**
```
n8n Workflow:
1. Webhook trigger (new lead)
2. Browserless API → Screenshots
3. Google PageSpeed Insights → Performance
4. OpenAI → Analysis text
5. ElevenLabs → Voiceover
6. Shotstack/Renderforest → Video assembly
7. SendGrid → Email delivery
```

## **VIDEO STRUCTURE (2-3 minutes)**

### **Scene 1: Introduction (0-30s)**
- "Hi [Business Name], I'm reviewing your website..."
- Show current homepage
- Voiceover: "I noticed a few opportunities to get more leads..."

### **Scene 2: Problem Analysis (30-90s)**
- Screen recording navigating site
- Voiceover pointing out specific issues:
  - "Mobile experience could be improved..."
  - "Contact form isn't prominent..."
  - "Services aren't clearly listed..."
  - "Page load time is slow..."

### **Scene 3: Solution Preview (90-150s)**
- Side-by-side comparison
- Left: Current site issues highlighted
- Right: Our template solution
- Voiceover: "Here's how we'd fix this..."

### **Scene 4: Call-to-Action (150-180s)**
- "For $500, we can have this fixed in 24 hours..."
- Show pricing/contact info
- "Reply to this email to schedule a call..."

## **ANALYSIS CRITERIA**

### **Technical (0-10 score)**
1. Mobile responsiveness (3 points)
2. Page load speed (2 points)
3. SSL security (1 point)
4. Browser compatibility (2 points)
5. Error-free (2 points)

### **Design (0-10 score)**
1. Modern appearance (3 points)
2. Professional layout (2 points)
3. Color scheme (2 points)
3. Typography (1 point)
4. Image quality (2 points)

### **Content (0-10 score)**
1. Clear services (3 points)
2. Contact info prominent (2 points)
3. Call-to-action (2 points)
4. About/bio (1 point)
5. Testimonials (2 points)

### **SEO (0-10 score)**
1. Meta tags (2 points)
2. Heading structure (2 points)
3. Image alt text (1 point)
4. URL structure (2 points)
5. Mobile-friendly (3 points)

**Total Score:** 0-40 points
- **0-15:** Critical need (Priority A)
- **16-25:** Significant need (Priority B)
- **26-35:** Moderate need (Priority C)
- **36-40:** Minor need (Priority D)

## **AUTOMATION REQUIREMENTS**

### **APIs Needed:**
1. **Screenshot API:** Browserless/Puppeteer
2. **Performance API:** Google PageSpeed Insights
3. **Analysis API:** OpenAI/Gemini
4. **Voice API:** ElevenLabs/Google TTS
5. **Video API:** Shotstack/Renderforest
6. **Email API:** SendGrid/Mailgun

### **n8n Nodes Required:**
- HTTP Request
- Code (JavaScript)
- OpenAI
- Email Send
- File/Storage
- Conditional logic

## **COST ESTIMATE**

### **Per Video:**
- Screenshot API: $0.01
- OpenAI analysis: $0.02
- Voice generation: $0.05
- Video assembly: $0.10
- **Total:** ~$0.18 per video

### **Monthly (100 videos):**
- API costs: $18
- n8n hosting: $20
- Storage: $5
- **Total:** ~$43/month

## **IMPLEMENTATION STEPS**

### **Phase 1: MVP (Week 1)**
1. Manual process documented
2. Basic screenshot capture
3. Template analysis script
4. Manual video assembly

### **Phase 2: Automation (Week 2)**
1. n8n workflow for capture
2. Automated analysis
3. Basic video generation
4. Email delivery

### **Phase 3: Scale (Week 3)**
1. Batch processing
2. Quality improvements
3. Analytics tracking
4. A/B testing

## **SUCCESS METRICS**

### **Video Performance:**
- View completion rate: 70%+
- Click-through rate: 15%+
- Response rate: 30%+
- Conversion rate: 10%+

### **Business Impact:**
- Lead quality improvement: 3x
- Sales cycle reduction: 50%
- Conversion rate increase: 2x
- ROI: 100x (cost $0.18 vs deal $500)

## **IMMEDIATE NEXT ACTIONS**

1. **Test manual process** with 3 sample leads
2. **Identify API keys needed** (check existing n8n setup)
3. **Create basic n8n workflow** for screenshot capture
4. **Build analysis template** for consistent scoring
5. **Produce 3 sample videos** manually for validation

## **RISKS & MITIGATION**

### **Technical Risks:**
- Websites blocking screenshots → Use multiple methods
- Video generation complexity → Start simple, improve
- API costs scaling → Batch processing

### **Business Risks:**
- Leads offended by criticism → Frame as "opportunities"
- Time investment vs return → Automate heavily
- Competitive response → Move fast, establish brand

## **ALTERNATIVES IF n8n NOT AVAILABLE**

### **Python Script:**
```python
# requirements.txt
# playwright, openai, moviepy, elevenlabs, sendgrid

async def create_review_video(url, business_name, email):
    # 1. Capture screenshots
    # 2. Analyze website
    # 3. Generate script
    # 4. Create voiceover
    # 5. Assemble video
    # 6. Send email
    pass
```

### **Zapier/Make:**
- Use existing automation platforms
- Higher cost but easier setup
- Less customizable

### **Manual First:**
- Create 10 videos manually
- Validate concept
- Then automate

---

**Ready to start building?** First step is checking available APIs and testing the manual process.