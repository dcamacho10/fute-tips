import nodemailer from "nodemailer";

const host = process.env.ETHEREAL_HOST
const user = process.env.ETHEREAL_USER
const pass = process.env.ETHEREAL_PASS

const transporter = nodemailer.createTransport({
  host: host,
  port: 587,
  secure: false,
  auth: {
    user: user,
    pass: pass
  }
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: user, // sender address
    to: "diogocamacho10@msn.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}