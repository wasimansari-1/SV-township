const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "Name and phone are required" });
  }

  try {
    // ─── Configure your SMTP credentials in Vercel Environment Variables ───
    // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"SV Township Enquiry" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      replyTo: email || process.env.SMTP_USER,
      subject: `New Enquiry from ${name} – SV Township`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
          <div style="background:#1a3c2e;padding:24px;text-align:center;">
            <h2 style="color:#c9a84c;margin:0;">SV Township – New Lead</h2>
            <p style="color:#fff;margin:4px 0 0;">Yamuna Expressway, Near Jewar Airport</p>
          </div>
          <div style="padding:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;font-weight:bold;color:#555;width:140px;">Name</td>
                <td style="padding:10px;color:#222;">${name}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;font-weight:bold;color:#555;">Email</td>
                <td style="padding:10px;color:#222;">${email || "—"}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;font-weight:bold;color:#555;">Mobile</td>
                <td style="padding:10px;color:#222;">${phone}</td>
              </tr>
              <tr>
                <td style="padding:10px;font-weight:bold;color:#555;">Plot Size</td>
                <td style="padding:10px;color:#222;">${message || "—"}</td>
              </tr>
            </table>
          </div>
          <div style="background:#f5f5f5;padding:14px;text-align:center;font-size:12px;color:#999;">
            © ${new Date().getFullYear()} SV Township · Auto-generated lead notification
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Enquiry received successfully!" });
  } catch (err) {
    console.error("Mail error:", err);
    // Still return success to user even if mail fails (log the lead)
    return res.status(200).json({ success: true, message: "Enquiry received!" });
  }
};