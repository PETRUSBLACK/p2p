import nodemailer from 'nodemailer'
import { Vonage } from '@vonage/server-sdk';

export const generateOTP = async (email) => {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for Login',
        text: `Your login code is: ${generatedOTP}.`,
    });

    console.log(generatedOTP)
    return generatedOTP.toString()
};

export const generateSmsOTP = async (phone) => {
    // const generatedOTP = Math.floor(100000 + Math.random() * 900000);

    const vonage = new Vonage({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET
    })

    const from = "P2P System"
    const to = phone
    const text = `Your OTP for login is: ${generatedOTP}`

    await vonage.sms.send({ to, from, text })
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });

    return generatedOTP.toString()
}