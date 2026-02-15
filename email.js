const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const senderEmail = process.env.SENDER_EMAIL;
const region = process.env.AWS_REGION;

const sesClient = region
  ? new SESClient({ region })
  : null;

async function sendTodoNotification(email, title) {
  if (!sesClient || !senderEmail) {
    console.log('SES not configured, skipping email notification');
    return;
  }

  try {
    await sesClient.send(
      new SendEmailCommand({
        Source: senderEmail,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: `TODO作成通知: ${title}` },
          Body: {
            Text: { Data: `新しいTODOが作成されました:\n\n${title}` },
            Html: { Data: `<h2>新しいTODOが作成されました</h2><p>${title}</p>` },
          },
        },
      })
    );
    console.log(`Notification email sent to ${email}`);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}

module.exports = { sendTodoNotification };
