const nodemailer = require('nodemailer');
const User = require('../models/User');

let transporter = null;

const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
};

const sendAnnouncementEmail = async ({ to, name, title, message, createdByName }) => {
  const transport = getTransporter();
  if (!transport) {
    console.warn('Email not sent: SMTP is not configured in .env');
    return false;
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  await transport.sendMail({
    from: `"Employee Management" <${from}>`,
    to,
    subject: `New Announcement: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Company Announcement</h2>
        <p>Hello ${name || 'Team Member'},</p>
        <p>A new announcement has been published by <strong>${createdByName || 'Admin'}</strong>.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px;">${title}</h3>
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Log in to the Employee Management portal to view all announcements.
        </p>
      </div>
    `,
    text: `New Announcement: ${title}\n\n${message}\n\n— ${createdByName || 'Admin'}`
  });

  return true;
};

const notifyEmployeesOfAnnouncement = async ({ title, message, createdByName }) => {
  if (!isEmailConfigured()) {
    return { sent: 0, failed: 0, skipped: true };
  }

  const employees = await User.find({
    role: 'employee',
    is_active: true
  }).select('email name');

  let sent = 0;
  let failed = 0;

  await Promise.all(
    employees.map(async (emp) => {
      try {
        await sendAnnouncementEmail({
          to: emp.email,
          name: emp.name,
          title,
          message,
          createdByName
        });
        sent++;
      } catch (err) {
        failed++;
        console.error(`Failed to email ${emp.email}:`, err.message);
      }
    })
  );

  return { sent, failed, skipped: false, total: employees.length };
};

module.exports = {
  isEmailConfigured,
  sendAnnouncementEmail,
  notifyEmployeesOfAnnouncement
};
