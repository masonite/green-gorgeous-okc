// Simple test to check if Brevo SMTP is working
const nodemailer = require('nodemailer');

// Brevo SMTP configuration
const brevoConfig = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'test@example.com',
    pass: process.env.SMTP_PASS || 'test'
  }
};

async function testBrevo() {
  console.log('Testing Brevo SMTP configuration...');
  console.log('SMTP User:', brevoConfig.auth.user ? 'Set' : 'Not set');
  console.log('SMTP Pass:', brevoConfig.auth.pass ? 'Set' : 'Not set');
  
  if (brevoConfig.auth.user === 'test@example.com' || !brevoConfig.auth.pass) {
    console.log('❌ Brevo credentials not configured. Set SMTP_USER and SMTP_PASS environment variables.');
    console.log('To configure in Netlify:');
    console.log('1. Go to Netlify Dashboard → Site Settings → Environment Variables');
    console.log('2. Add: SMTP_USER=your-brevo-email@domain.com');
    console.log('3. Add: SMTP_PASS=your-brevo-smtp-password');
    console.log('4. Redeploy site');
    return false;
  }
  
  try {
    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport(brevoConfig);
    
    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Test email
    const testEmail = {
      from: '"Nice Lawn OKC Test" <test@nicelawnokc.com>',
      to: 'test@example.com', // Replace with your email
      subject: 'Test email from Nice Lawn OKC Brevo SMTP',
      text: 'This is a test email to verify Brevo SMTP is working correctly.',
      html: '<h1>Brevo SMTP Test</h1><p>This is a test email to verify Brevo SMTP is working correctly.</p>'
    };
    
    console.log('Sending test email...');
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    return true;
    
  } catch (error) {
    console.error('❌ Brevo SMTP test failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// Run test
testBrevo().then(success => {
  if (success) {
    console.log('\n🎉 Brevo SMTP is configured and working!');
    console.log('You can now send the newsletter.');
  } else {
    console.log('\n⚠️  Brevo SMTP needs configuration.');
    console.log('Check:');
    console.log('1. SMTP_USER and SMTP_PASS environment variables in Netlify');
    console.log('2. Brevo account is active and SMTP enabled');
    console.log('3. Port 587 is not blocked');
  }
});