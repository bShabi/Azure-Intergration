const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  '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'
);
const sendMail = async (from, to, subject, text, callback) => {
  const msg = {
    to: to,
    from: from,
    subject: subject,
    text: text,
    html: `<strong>${text}</strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent to ', to);
      callback();
    })
    .catch((error) => {
      console.error(error.response.body);
      callback();
    });
};
module.exports = sendMail;
