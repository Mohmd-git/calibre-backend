import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";


const sendMagicLink = async (req, res) => {
  try {
    const { email } = req.body;


    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Unauthorized admin email" });
    }

    // Find or create admin
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = await Admin.create({ email });
    }

    // Generate JWT token (expires in 15 mins)
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Magic link URL
    const magicLink = `${process.env.FRONTEND_URL}/admin-verify?token=${token}`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",
  headers: {
    accept: "application/json",
    "api-key": process.env.BREVO_API_KEY,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    sender: {
      name: "Calibre Tutorials",
      email: process.env.SMTP_USER,
    },
    to: [{ email }],
    subject: "🔐 Your Secure Admin Login Link",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px;">
        <h2 style="color: #4f46e5;">Calibre Tutorials Admin Access</h2>
        <p>Click the button below to securely log in. This link expires in <strong>15 minutes</strong>.</p>

        <a href="${magicLink}"
           style="display:inline-block;margin-top:20px;padding:12px 24px;background:#4f46e5;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Login to Admin Panel
        </a>

        <p style="margin-top:20px;color:#999;font-size:12px;">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  }),
});

if (!response.ok) {
  const error = await response.text();
  throw new Error(error);
}
    res.json({ message: "Magic link sent to your email!" });
  } catch (err) {
    console.log("❌ Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// VERIFY TOKEN
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sessionToken = jwt.sign(
  { id: decoded.id, email: decoded.email },
  process.env.JWT_SECRET,
  { expiresIn: "12h" }
);
    res.json({ token: sessionToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { sendMagicLink, verifyToken };