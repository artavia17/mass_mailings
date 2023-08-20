/**
 * En este apartado se logra configurar el servidor para enviar emails
 */

const nodemailer = require('nodemailer');


const transport = async () => {

    return  nodemailer.createTransport({
        host: process.env.MAIL_HOST, // El servidor SMTP que usarás
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME, // Tu correo electrónico
          pass: process.env.MAIL_PASSWORD // Tu contraseña
        }
    });

}


const mailsend  = async (from, to, subject, html) => {

    const message = {
        from: from,
        to: to,
        subject: subject,
        html: html
    };

    const config = nodemailer.createTransport({
        host: process.env.MAIL_HOST, // El servidor SMTP que usarás
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME, // Tu correo electrónico
          pass: process.env.MAIL_PASSWORD // Tu contraseña
        }
    });

    await config.sendMail(message, (err, info) => {
        if (err) {
            return 403;
        } else {
            return 202;
        }
    });

}


module.exports = {
    mailsend
};