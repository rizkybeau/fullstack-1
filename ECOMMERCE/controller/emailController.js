const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID, // generated ethereal user
      pass: process.env.MP, // generated ethereal password
    },
  });
  console.log('info');
  let details = {
    from: 'ethereal', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.htm, // html body
  };
  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: '"Fred Foo 👻" <abc@gmail.com.com>', // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
      html: data.htm, // html body
    },
    (err) => {
      if (err) {
        console.log('gagal');
      } else {
        console.log('sukses');
      }
    }
  );
});

module.exports = sendEmail;
