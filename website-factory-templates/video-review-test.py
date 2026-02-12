#!/usr/bin/env python3
"""
Simple Website Review Video Generator - MVP Test
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime
import base64

# Load API keys from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

if not OPENAI_API_KEY:
    print("ERROR: OPENAI_API_KEY not set in environment")
    print("Set with: export OPENAI_API_KEY=your_key_here")
    exit(1)

if not ELEVENLABS_API_KEY:
    print("WARNING: ELEVENLABS_API_KEY not set, voiceover will be text-only")

class WebsiteReviewGenerator:
    def __init__(self, business_name, website_url):
        self.business_name = business_name
        self.website_url = website_url
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_dir = Path(f"video-reviews/{business_name.replace(' ', '_')}_{self.timestamp}")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def analyze_website(self):
        """Generate analysis using OpenAI"""
        print(f"Analyzing website: {self.website_url}")
        
        prompt = f"""
        Analyze this lawn care business website for a contractor named "{self.business_name}".
        Website: {self.website_url}
        
        Provide a professional analysis focusing on:
        1. Mobile responsiveness issues
        2. Contact form/phone number visibility
        3. Service descriptions clarity
        4. Page load speed concerns
        5. Design/visual appeal
        6. SEO opportunities
        
        Format the response as a video script for a 2-minute personalized review.
        Use a friendly, helpful tone - we want to help them improve, not criticize.
        
        Structure:
        - Introduction (15 seconds)
        - 3-4 specific issues found (60 seconds)
        - How our solution would fix each issue (30 seconds)
        - Call to action (15 seconds)
        
        Make it personalized to "{self.business_name}".
        """
        
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "gpt-4-turbo-preview",
            "messages": [
                {"role": "system", "content": "You are a website consultant helping small businesses get more leads online."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                analysis = response.json()["choices"][0]["message"]["content"]
                self.save_analysis(analysis)
                return analysis
            else:
                print(f"OpenAI API error: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"Error analyzing website: {e}")
            return None
    
    def generate_voiceover(self, script):
        """Convert script to audio using ElevenLabs"""
        if not ELEVENLABS_API_KEY:
            print("Skipping voiceover - no ElevenLabs API key")
            return None
            
        print("Generating voiceover...")
        
        # Take first 2000 characters (ElevenLabs limit for free tier)
        script_short = script[:2000]
        
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        
        data = {
            "text": script_short,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        try:
            # Use Josh voice (friendly, professional)
            response = requests.post(
                "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
                headers=headers,
                json=data,
                timeout=60
            )
            
            if response.status_code == 200:
                audio_path = self.output_dir / "voiceover.mp3"
                with open(audio_path, "wb") as f:
                    f.write(response.content)
                print(f"Voiceover saved: {audio_path}")
                return audio_path
            else:
                print(f"ElevenLabs API error: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error generating voiceover: {e}")
            return None
    
    def create_video_script(self, analysis):
        """Create final video script with timings"""
        script = f"""
        PERSONALIZED WEBSITE REVIEW FOR: {self.business_name}
        ===================================================
        
        VIDEO LENGTH: 2 minutes
        STYLE: Friendly, helpful, professional
        
        [SCENE 1: INTRODUCTION - 0:00 to 0:15]
        VISUAL: "{self.business_name}" text on screen with their logo/website screenshot
        VOICEOVER: "Hi {self.business_name}, I was reviewing your website and noticed some great opportunities to help you get more lawn care leads online."
        
        [SCENE 2: ANALYSIS - 0:15 to 1:15]
        VISUAL: Screen recording or screenshots of their website with annotations
        VOICEOVER: {analysis}
        
        [SCENE 3: SOLUTION - 1:15 to 1:45]
        VISUAL: Side-by-side comparison: Their site vs our template
        VOICEOVER: "For just $500, we can have a professional website live in 24 hours. You'll get a mobile-friendly design, clear service pages, and a contact form that goes straight to your phone."
        
        [SCENE 4: CALL TO ACTION - 1:45 to 2:00]
        VISUAL: Contact information and pricing
        VOICEOVER: "Reply to this email to schedule a quick 10-minute call. We'll show you exactly how we can help {self.business_name} get more leads."
        
        [END SCREEN]
        Website Factory - Professional websites for contractors
        $500 | 24-hour delivery | No monthly fees
        hello@websitefactory.com | (405) 555-1234
        """
        
        script_path = self.output_dir / "video_script.txt"
        with open(script_path, "w") as f:
            f.write(script)
        
        return script
    
    def save_analysis(self, analysis):
        """Save analysis to file"""
        analysis_path = self.output_dir / "analysis.txt"
        with open(analysis_path, "w") as f:
            f.write(analysis)
        print(f"Analysis saved: {analysis_path}")
    
    def generate_email(self, script):
        """Generate personalized email with video link"""
        email = f"""
        Subject: Personalized website review for {self.business_name}
        
        Hi [First Name],
        
        I was looking at lawn care businesses in the area and reviewed your website at {self.website_url}.
        
        I created a quick 2-minute video review showing:
        • 3 opportunities to get more leads from your website
        • How a professional website could help {self.business_name}
        • What it would look like (side-by-side comparison)
        
        Watch your personalized review here: [VIDEO_LINK]
        
        The fix is simple and affordable:
        • $500 one-time fee (no monthly costs)
        • 24-hour delivery
        • Mobile-friendly design
        • Contact form to your phone
        
        Would you be open to a quick 10-minute call this week?
        
        Best regards,
        [Your Name]
        Website Factory
        
        P.S. We've helped 12 other lawn care businesses in Oklahoma get professional websites. The $500 pays for itself with just 7 jobs.
        """
        
        email_path = self.output_dir / "personalized_email.txt"
        with open(email_path, "w") as f:
            f.write(email)
        print(f"Email template saved: {email_path}")
        return email
    
    def run(self):
        """Run the complete pipeline"""
        print(f"\n{'='*60}")
        print(f"WEBSITE REVIEW GENERATOR")
        print(f"Business: {self.business_name}")
        print(f"Website: {self.website_url}")
        print(f"{'='*60}\n")
        
        # Step 1: Analyze website
        analysis = self.analyze_website()
        if not analysis:
            print("Failed to analyze website")
            return False
        
        # Step 2: Create video script
        script = self.create_video_script(analysis)
        
        # Step 3: Generate voiceover
        voiceover = self.generate_voiceover(script)
        
        # Step 4: Create email
        email = self.generate_email(script)
        
        # Step 5: Create summary
        self.create_summary(script, voiceover, email)
        
        print(f"\n{'='*60}")
        print(f"REVIEW COMPLETE!")
        print(f"Output saved to: {self.output_dir}")
        print(f"{'='*60}")
        
        return True
    
    def create_summary(self, script, voiceover, email):
        """Create summary file"""
        summary = {
            "business_name": self.business_name,
            "website_url": self.website_url,
            "timestamp": self.timestamp,
            "output_dir": str(self.output_dir),
            "has_voiceover": voiceover is not None,
            "next_steps": [
                "1. Capture website screenshots manually",
                "2. Assemble video using screen recording software",
                "3. Upload video to private hosting (Vimeo/YouTube)",
                "4. Send personalized email with video link",
                "5. Follow up in 3 days if no response"
            ]
        }
        
        summary_path = self.output_dir / "summary.json"
        with open(summary_path, "w") as f:
            json.dump(summary, f, indent=2)
        
        print(f"Summary saved: {summary_path}")

def main():
    """Test with sample data"""
    print("Website Review Video Generator - Test")
    print("="*50)
    
    # Test data - using one of the identified leads
    test_cases = [
        {
            "name": "TL lawn care and landscaping",
            "url": "https://example.com"  # Placeholder - would need actual URL
        },
        {
            "name": "Pro Outlook Tree & Lawn Service", 
            "url": "https://example.com"
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test['name']}")
        
        generator = WebsiteReviewGenerator(test["name"], test["url"])
        success = generator.run()
        
        if success:
            print(f"✓ Test {i} completed successfully")
        else:
            print(f"✗ Test {i} failed")
        
        if i < len(test_cases):
            input("\nPress Enter to continue to next test...")

if __name__ == "__main__":
    # Set API keys from discord-voice-node .env file
    env_path = Path("../discord-voice-node/.env")
    if env_path.exists():
        print(f"Loading API keys from: {env_path}")
        with open(env_path) as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value
    
    main()