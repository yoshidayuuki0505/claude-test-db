const sgMail = require('@sendgrid/mail');

const apiKey = process.env.SENDGRID_API_KEY;
const senderEmail = process.env.SENDER_EMAIL;

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

async function sendTodoNotification(email, title) {
  if (!apiKey || !senderEmail) {
    console.log('SendGrid not configured, skipping email notification');
    return;
  }

  try {
    await sgMail.send({
      to: email,
      from: senderEmail,
      subject: `TODO作成通知: ${title}`,
      text: `新しいTODOが作成されました:\n\n${title}`,
      html: `<h2>新しいTODOが作成されました</h2><p>${title}</p>`,
    });
    console.log(`Notification email sent to ${email}`);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

module.exports = { sendTodoNotification };
