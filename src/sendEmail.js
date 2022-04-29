const nodemailer = require('nodemailer')

const SMTP_CONFIG = require('./config/smtp')

const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
})

async function run()
{
    const mailSent = await transporter.sendMail({
        text: "Email marketing",
        subject: "Você esqueceu disso!",
        from: "<emailmarket128@gmail.com>",
        to: ["luisjuniorfrota@gmail.com", "vladimir.nicolau45@gmail.com"],
        html: `
        <html>
            <strong>Compre imediatamente</strong>
        </html>
        `,
    })

    console.log(mailSent)
}
//run()