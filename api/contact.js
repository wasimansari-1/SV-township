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
    `Plot Size: ${data.message || '-'}`,
    `Page: ${data.page || '-'}`,
    `Time: ${new Date().toLocaleString()}`
  ].join('\n');
}

function buildMailHtml(data) {
  return `
    <div style="font-family:Arial,sans-serif;padding:20px">
      <h2>🏡 New Lead - SV Township</h2>

      <table cellpadding="10" cellspacing="0" border="1"
      style="border-collapse:collapse;width:100%">
        <tr>
          <td><b>Name</b></td>
          <td>${escapeHtml(data.name || '-')}</td>
        </tr>

        <tr>
          <td><b>Email</b></td>
          <td>${escapeHtml(data.email || '-')}</td>
        </tr>

        <tr>
          <td><b>Phone</b></td>
          <td>${escapeHtml(data.phone || '-')}</td>
        </tr>

        <tr>
          <td><b>Plot Size</b></td>
          <td>${escapeHtml(data.message || '-')}</td>
        </tr>

        <tr>
          <td><b>Page</b></td>
          <td>${escapeHtml(data.page || '-')}</td>
        </tr>

        <tr>
          <td><b>Time</b></td>
          <td>${new Date().toLocaleString()}</td>
        </tr>
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
    return res.status(405).json({
      success: false,
      error: 'Only POST allowed'
    });
  }

  try {

    const data =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body || {});

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const phone = String(data.phone || '').trim();
    const message = String(data.message || '').trim();
    const page = data.page || 'SV Township Landing';

    if (name.length < 2) {
      return res.status(400).json({
        success:false,
        error:'Name required'
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        success:false,
        error:'Phone required'
      });
    }

    // ===== SMTP ENV =====

    const smtpHost =
      process.env.SMTP_HOST || 'smtp.gmail.com';

    const smtpPort =
      Number(process.env.SMTP_PORT || 587);

    const smtpUser =
      process.env.SMTP_USER;

    const smtpPass =
      process.env.SMTP_PASS;

    const mailTo =
      process.env.MAIL_TO ||
      'afshank998@gmail.com';

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({
        success:false,
        error:'SMTP ENV missing'
      });
    }

    const transporter =
      nodemailer.createTransport({

        host: smtpHost,

        port: smtpPort,

        secure:false,

        auth:{
          user:smtpUser,
          pass:smtpPass
        }

      });

    await transporter.sendMail({

      from:
      `"SV Township Leads" <${smtpUser}>`,

      to:mailTo,

      replyTo:
      email || smtpUser,

      subject:
      `SV Township Lead - ${name}`,

      text:
      buildMailText({
        name,
        email,
        phone,
        message,
        page
      }),

      html:
      buildMailHtml({
        name,
        email,
        phone,
        message,
        page
      })

    });

    return res.status(200).json({
      success:true,
      message:'Mail sent'
    });

  }
  catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      error:error.message
    });

  }

};