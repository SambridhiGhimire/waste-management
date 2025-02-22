const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail as the service
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Use the generated App Password
  },
});

const sendResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Support Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset Request</h3>
      <p>You have requested to reset your password. Click the link below to reset:</p>
      <a href="${resetLink}" style="background: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
