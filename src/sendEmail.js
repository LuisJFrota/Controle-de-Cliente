const nodemailer = require('nodemailer')

const SMTP_CONFIG = require('./config/smtp')
const ejs = require('ejs')

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


async function sendEmail(x = [])
{
    await ejs.renderFile(__dirname + "/views/email.ejs", (err, data) =>{
        if(err)
        {
            console.log(err)
        }
        else{
            const mailSent = transporter.sendMail({
                text: "Email marketing",
                subject: "Você esqueceu disso!",
                from: "<emailmarket128@gmail.com>",
                bcc: x,
                html: data,
                attachments: [
                    {
                    filename: 'contato.png',
                    path: __dirname + '/views/img/email/contato.png',
                    cid: 'contato'
                    },
                    {
                    filename: 'email_03.png',
                    path: __dirname + '/views/img/email/email_03.png',
                    cid: 'email3'
                    },
                    {
                    filename: 'produto.png',
                    path: __dirname + '/views/img/email/produto.png',
                    cid: 'produto'
                    },
                    {
                    filename: 'comprar.png',
                    path: __dirname + '/views/img/email/comprar.png',
                    cid: 'comprar'
                    },
                    {
                    filename: 'email_01.png',
                    path: __dirname + '/views/img/email/email_01.png',
                    cid: 'email1'
                    }
                ]
            })
        }       
    })    
}

async function sendEmailTemplate(x = [], template)
{
    await ejs.renderFile(__dirname + "/views/email.ejs", (err, data) =>{
        if(err)
        {
            console.log(err)
        }
        else{
            const mailSent = transporter.sendMail({
                text: "Email marketing",
                subject: "Você esqueceu disso!",
                from: "<emailmarket128@gmail.com>",
                bcc: x,
                html: template,               
            })
        }       
    })    
}

module.exports = {sendEmail,sendEmailTemplate}