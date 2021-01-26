require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require("helmet");
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

const port = process.env.PORT || 3000;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
});

app.get('/', (req, res) => {
    res.send('Up and running!');
});

app.post('/tax-and-vat/contact-us-form', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.TAX_AND_VAT_EMAIL_RECIPIENT,
        subject: 'Tax & VAT - Website Contact Us Form',
        text: `
            name: ${name}
            email: ${email}
            message: ${message}
        `,
    };

    try {
        transporter.sendMail(mailOptions, function (error, info) {
            let status = 200;
            if (error) status = 500;
            res.status(status).send();
        });
    } catch (error) {
        res.status(500).send();
    }
});

app.listen(port, () => {
    console.log(`Mailer app listening at port: ${port}`)
});