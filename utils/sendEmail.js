// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text, html) => {
  try {
    console.log("📧 Attempting to send email to:", to);
    console.log("📧 Subject:", subject);
    
    // Create transporter dynamically to ensure fresh environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    const info = await transporter.sendMail({
      from: `"Data Clinic" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    // ✅ Success log
    console.log("📧 Email sent successfully!");
    console.log("➡️ To:", to);
    console.log("📌 Subject:", subject);
    console.log("🆔 Message ID:", info.messageId);

    return info;
  } catch (err) {
    // ❌ Failure log
    console.error("❌ Email sending failed!");
    console.error("Error details:", err.message);
    return null;
  }
};

export default sendEmail;