const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: 'polunandeeswar341@gmail.com', // Your email
      pass: 'zkbq ebqr dbkw dxsp', // Your email password or app password
    },
  });

  const mailOptions = {
    from: 'polunandeeswar341@gmail.com', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
