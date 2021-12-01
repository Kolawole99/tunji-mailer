require('dotenv').config();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, FROM_EMAIL } = process.env;

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

async function sendEmail(email, subject, payload, template) {
    try {
        const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
        const compiledTemplate = handlebars.compile(source);
        const options = () => ({
            from: FROM_EMAIL,
            to: email,
            subject,
            html: compiledTemplate(payload),
        });

        return await transporter.sendMail(options());
    } catch (error) {
        return error;
    }
}

module.exports = sendEmail;
