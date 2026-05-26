import { sendContactEmail } from "../utils/sendContactEmail.js";

export const sendContact = async (req, res) => {
    console.log("API HIT ✅", req.body);
  try {
    const { name, phone, email, purpose, course, message } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    await sendContactEmail({
      name,
      phone,
      email,
      purpose,
      course,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send inquiry",
    });
  }
};