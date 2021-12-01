const nodemailer = require('nodemailer');
const sendMail = async (from, to, subject, text, callback) => {
  let err = null;
  let transporter = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'strapinoreply@gmail.com',
      pass: 'strapi@strapier',
    },
  });

  // Step 2
  let mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: `<h3>${text} </h3>`,
  };

  // Step 3
  const mailing = await transporter.sendMail(mailOptions, async (err, data) => {
    if (err) {
      console.log(err);
      return (err = true);
    }
    return console.log('Email sent to ', to);
  });
};

module.exports = sendMail;
