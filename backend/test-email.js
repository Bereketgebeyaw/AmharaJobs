require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    
    // Test connection
    await transporter.verify();
    console.log('✅ Email server connection successful');
    
    // Send test email
    const info = await transporter.sendMail({
      from: `AmharaJobs <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email from AmharaJobs',
      html: '<p>This is a test email to verify email functionality.</p>'
    });
    
    console.log('✅ Test email sent successfully');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.error('💡 Check your Gmail app password');
    } else if (error.message.includes('Less secure app access')) {
      console.error('💡 Enable 2FA and use app password');
    }
  }
}

testEmail();
