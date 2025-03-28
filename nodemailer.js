const nodemailer = require("nodemailer");
const { config } = require("./config/config")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true, // true for port 465, false for other ports
  port: 465,
  auth: {
    user: config.gmailUser,
    pass: config.gmailPassword
  }
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" ' + config.gmailUser, // sender address
    to: "charlymeneces6@gmail.com", // list of receivers
    subject: "Este correo viene de mi app de Node (subject)", // Subject line
    text: "(text) hola, este es mi primer correo enviado de una app", // plain text body
    html: "<b>Hello charly</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

sendMail();
