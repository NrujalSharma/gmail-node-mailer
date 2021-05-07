require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require("helmet");
const nodemailer = require('nodemailer');
const cors = require('cors');

const corsOptions = {
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());


const port = process.env.PORT || 4000;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

app.get('/', (req, res) => {
    res.send('Up and running!');
});

// app.options('/tax-and-vat/contact-us-form', cors({ ...corsOptions, origin: process.env.TAX_AND_VAT_ORIGIN }))
app.post('/tax-and-vat/contact-us-form', cors({ ...corsOptions, origin: process.env.TAX_AND_VAT_ORIGIN }), async (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.TAX_AND_VAT_EMAIL_RECIPIENT,
        subject: 'Tax & VAT - Website Contact Us Form',
        text: `
            name: ${name}
            email: ${email}
            message: ${message}
        `
    };

    try {
        await sendMail(mailOptions);
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

// app.options('/vaccine-session/inform', cors({ ...corsOptions, origin: process.env.VACCINE_APPOINTMENT_ORIGIN }))
app.post('/vaccine-session/inform', cors({ ...corsOptions, origin: process.env.VACCINE_APPOINTMENT_ORIGIN }), async (req, res) => {
    const { data } = req.body;

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.VACCINE_APPOINTMENT_EMAIL_RECIPIENT,
        subject: 'Vaccines Available',
        text: JSON.stringify(data, null, 2)
    };

    try {
        await sendMail(mailOptions);
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

function sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, _) {
            if (error) reject(error);
            resolve();
        });
    });
}

app.listen(port, () => {
    console.log(`Mailer app listening at port: ${port}`)
});
