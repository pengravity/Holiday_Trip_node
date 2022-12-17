const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //    create transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2 define the email options
  const mailOptions = {
    from: 'Andy<andy@holidaytrips.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3 send the email
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
