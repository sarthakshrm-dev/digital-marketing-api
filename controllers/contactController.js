const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async ({ name, email, message, phone }) => {
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
      <p>Phone No.: ${phone}</p>
      <p>Message:</p>
      <p>${message}</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};

exports.handleContactForm = async (req, res) => {
    const { name, email, message, phone, token } = req.body;

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

        await sendMail({ name, email, message, phone }).catch((err) =>
            console.error('Error sending email in background:', err)
        );

        res.status(200).json({ success: true, message: 'Email Sent!' });
    } catch (error) {
        console.error('Error in contact API:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};