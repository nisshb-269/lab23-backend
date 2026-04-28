const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const welcomeEmailTemplate = (userName) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Welcome</title></head>
<body style="margin:0;padding:0;background-color:#f5f0ea;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(26,20,16,0.08);">
        <tr>
          <td style="background:#c0522a;padding:36px 40px;text-align:center;">
            <span style="font-size:24px;font-weight:700;color:#ffffff;">● AuthFlow</span>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Secure Authentication Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:48px 40px 32px;">
            <h1 style="margin:0 0 16px;font-size:28px;color:#1a1410;">Welcome aboard, ${userName}! 🎉</h1>
            <p style="margin:0 0 24px;font-size:16px;color:#6b5d52;line-height:1.7;">
              Thank you for joining <strong>AuthFlow</strong>. Your account has been successfully created.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f2;border:1px solid #e2d9ce;border-radius:8px;margin-bottom:32px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;color:#a8978a;font-weight:600;">Account Details</p>
                <p style="margin:0;font-size:15px;color:#1a1410;font-weight:500;">Name: ${userName}</p>
                <p style="margin:6px 0 0;font-size:13px;color:#6b5d52;">Joined: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#c0522a;border-radius:8px;">
                <a href="http://localhost:5173/login" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">Go to Login →</a>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #e2d9ce;background:#f9f6f2;">
            <p style="margin:0;font-size:12px;color:#a8978a;">© ${new Date().getFullYear()} AuthFlow. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: `"AuthFlow" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Welcome to AuthFlow! 🎉',
    html: welcomeEmailTemplate(userName),
  }
  await transporter.sendMail(mailOptions)
}

module.exports = { sendWelcomeEmail }
