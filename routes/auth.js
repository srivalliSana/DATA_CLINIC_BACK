import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js"; // ✅ mail utility

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

/* --------------------------
   REGISTER
--------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email, password: hashed });
    await user.save();

    // ✅ Send Welcome Email
    console.log("📧 Attempting to send welcome email to:", email);
    const emailResult = await sendEmail(
      email,
      "Welcome to Data Clinic 🎉",
      `Hi ${name}, welcome to Data Clinic! We're glad to have you.`,
      `<h2>Hi ${name},</h2><p>🎉 Welcome to <b>Data Clinic</b>! We're excited to have you onboard.</p>`
    );
    console.log("📧 Welcome email result:", emailResult ? "Success" : "Failed");

    // ✅ Generate JWT (same as login)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------
   FORGOT PASSWORD
--------------------------- */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.json({ 
        message: "If your email is registered, you will receive a password reset link shortly." 
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store token in user document (optional, for extra security)
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:5173/auth/reset-password?token=${resetToken}`;

    // Send password reset email
    console.log("📧 Sending password reset email to:", email);
    const emailResult = await sendEmail(
      email,
      "Password Reset Request",
      `Click the following link to reset your password: ${resetUrl}`,
      `<h2>Password Reset</h2>
       <p>You requested a password reset for your Data Clinic account.</p>
       <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
       <a href="${resetUrl}" style="display: inline-block; background-color: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px;">Reset Password</a>
       <p>If you didn't request this, please ignore this email.</p>`
    );
    console.log("📧 Password reset email result:", emailResult ? "Success" : "Failed");

    res.json({ 
      message: "If your email is registered, you will receive a password reset link shortly." 
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

/* --------------------------
   RESET PASSWORD
--------------------------- */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user with matching token
    const user = await User.findOne({ 
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    // Send confirmation email
    console.log("📧 Sending password change confirmation email to:", user.email);
    const emailResult = await sendEmail(
      user.email,
      "Password Changed Successfully",
      `Your password for Data Clinic has been changed successfully.`,
      `<h2>Password Changed</h2>
       <p>Your password for Data Clinic has been changed successfully.</p>
       <p>If you did not make this change, please contact support immediately.</p>`
    );
    console.log("📧 Password change confirmation email result:", emailResult ? "Success" : "Failed");

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

/* --------------------------
   LOGIN
--------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Send Welcome Back Email
    console.log("📧 Attempting to send welcome back email to:", email);
    const emailResult = await sendEmail(
      email,
      "Welcome Back 👋",
      `Hi ${user.name}, welcome back to Data Clinic!`,
      `<h2>Hi ${user.name},</h2><p>👋 Welcome back to <b>Data Clinic</b>. We're happy to see you again!</p>`
    );
    console.log("📧 Welcome back email result:", emailResult ? "Success" : "Failed");

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------
   GOOGLE OAUTH CALLBACK
--------------------------- */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/auth/login",
  }),
  async (req, res) => {
    try {
      const { email, name } = req.user;

      let user = await User.findOne({ email });

      if (!user) {
        // First-time Google signup
        user = new User({ name, email, password: null });
        await user.save();
      }

      // Send Welcome Back Email for Google login
      console.log("📧 Attempting to send Google welcome back email to:", email);
      const emailResult = await sendEmail(
        email,
        "Welcome Back 👋",
        `Hi ${user.name}, welcome back to Data Clinic!`,
        `<h2>Hi ${user.name},</h2><p>👋 Welcome back to <b>Data Clinic</b>. We're happy to see you again!</p>`
      );
      console.log("📧 Google welcome back email result:", emailResult ? "Success" : "Failed");

      // Generate token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Redirect frontend with token + info
      res.redirect(
        `http://localhost:5173/auth/success?token=${token}&email=${encodeURIComponent(
          user.email
        )}&name=${encodeURIComponent(user.name)}`
      );
    } catch (err) {
      console.error("Google OAuth error:", err);
      res.redirect("http://localhost:5173/auth/login?error=oauth_failed");
    }
  }
);

/* --------------------------
   UPDATE PROFILE
--------------------------- */
router.put("/update-profile", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name.trim();
    await user.save();

    // Generate new token with updated info
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Profile updated successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

/* --------------------------
   CHANGE PASSWORD
--------------------------- */
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has a password (not Google OAuth user)
    if (!user.password) {
      return res.status(400).json({ message: "Password change not available for this account type" });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Generate new token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Password changed successfully",
      token,
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

export default router;
