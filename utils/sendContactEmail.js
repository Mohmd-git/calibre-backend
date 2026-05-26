/* ================= COMMON SEND FUNCTION ================= */

const sendEmail = async (to, subject, htmlContent) => {
  try {
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
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Brevo API Error:", error);
      throw new Error(`Brevo API Error: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Email could not be sent");
  }
};

/* ================= CONTACT EMAIL ================= */

export const sendContactEmail = async (data) => {
  const html = `
    <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
        <tr>
          <td align="center">
            <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,0.08);">
              
              <!-- HEADER -->
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#1884FF,#0f6ad9);padding:25px;">
                  <h2 style="color:#ffffff;margin:0;">New Inquiry Received</h2>
                  <p style="color:#e0e7ff;margin:5px 0 0;">Calibre Tutorials Website</p>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding:30px;">
                  
                  <h3 style="margin-bottom:20px;color:#111827;">Student Details</h3>

                  <p><b>Name:</b> ${data.name}</p>
                  <p><b>Phone:</b> ${data.phone}</p>
                  <p><b>Email:</b> ${data.email}</p>

                  <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

                  <p><b>Purpose:</b> ${data.purpose || "N/A"}</p>
                  <p><b>Course Interest:</b> ${data.course || "N/A"}</p>

                  <div style="margin-top:20px;">
                    <p style="font-weight:bold;margin-bottom:5px;">Message:</p>
                    <div style="background:#f3f4f6;padding:15px;border-radius:8px;">
                      ${data.message || "No message provided"}
                    </div>
                  </div>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td align="center" style="background:#f9fafb;padding:15px;font-size:12px;color:#9ca3af;">
                  © ${new Date().getFullYear()} Calibre Tutorials. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  await sendEmail(
    process.env.SMTP_USER, // 👉 YOU receive this
    "New Contact Inquiry 📩",
    html
  );
};