const nodemailer = require('nodemailer');

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildMailText(data) {
  return [
    'New lead submitted from SV Township landing page',
    '---------------------------------------------',
    `Name: ${data.name || '-'}`,
    `Email: ${data.email || '-'}`,
    `Phone: ${data.phone || '-'}`,
    `Plot Size / Message: ${data.message || '-'}`,
    `Page: ${data.page || '-'}`,
    `Time: ${new Date().toISOString()}`
  ].join('\n');
}

function buildMailHtml(data) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2>New lead submitted from SV Township landing page</h2>
      <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(data.name || '-')}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(data.email || '-')}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(data.phone || '-')}</td></tr>
        <tr><td><strong>Plot Size / Message</strong></td><td>${escapeHtml(data.message || '-')}</td></tr>
        <tr><td><strong>Page</strong></td><td>${escapeHtml(data.page || '-')}</td></tr>
        <tr><td><strong>Time</strong></td><td>${escapeHtml(new Date().toISOString())}</td></tr>
      </table>
    </div>
  `;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();
    const page = String(data.page || 'SV Township Landing Page').trim();

    if (name.length < 2) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (phone.length < 10) {
      return res.status(400).json({ success: false, error: 'Phone is required' });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const toEmail = process.env.TO_EMAIL || 'wk9523675@gmail.com';

    if (!gmailUser || !gmailAppPassword) {
      return res.status(500).json({
        success: false,
        error: 'Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables'
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      }
    });

    const subject = `SV Township Lead - ${name}`;
    const mailOptions = {
      from: `"SV Township Leads" <${gmailUser}>`,
      to: toEmail,
      replyTo: email || gmailUser,
      subject,
      text: buildMailText({ name, email, phone, message, page }),
      html: buildMailHtml({ name, email, phone, message, page })
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('contact api error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send mail' });
  }
};
