const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');

var transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
    secureConnection: false,
    tls: {
      ciphers:'SSLv3'
    },
    auth: {
      user: process.env.MAIL_AUTH_USER, 
      pass: process.env.MAIL_AUTH_PASS 
    }
  });


const generateHTML = (filename, options ={}) => {
	const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
	const inlined = juice(html);
	return inlined;
};

exports.send = async (options) => {
	const html = generateHTML(options.filename, options);
	const text = htmlToText.fromString(html);
	const mailOptions = {
		from: `goalsfortoday@outlook.com`,
		to: options.email,
		subject: options.subject,
		html: html,
		text: text
	};

    return transport.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })
};


