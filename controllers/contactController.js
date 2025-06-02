const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
const connectDB = require('./config/database');

const sendMail = async ({ name, email, message }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.TO_EMAIL,
        replyTo: email,
        subject: `New Contact Form By ${name}`,
        html: `
      <h3>Name: ${name}</h3>
      <p>Email: ${email}</p>
      <p>Message:</p>
      <p>${message}</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};

exports.handleContactForm = async (req, res) => {
      await connectDB();
    const { name, email, message, token } = req.body;

      if (!name || !email || !message || !token) {
        return res.status(400).json({ error: 'All fields including reCAPTCHA are required' });
      }

    try {
        const response = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
        );

        if (!response.data.success) {
          return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }

        res.status(200).json({ success: true, message: 'Message received! Sending email in background.' });

        await sendMail({ name, email, message }).catch((err) =>
            console.error('Error sending email in background:', err)
        );
    } catch (error) {
        console.error('Error in contact API:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};