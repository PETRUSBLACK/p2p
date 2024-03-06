import nodemailer from 'nodemailer'
import OTP from "../models/OTP.js";
import twilio from 'twilio'
const generatedOTP = Math.floor(100000 + Math.random() * 900000);

export const generateEmailOTP = async (email) => {

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
        text: `Your OTP for login is: ${generatedOTP}`,
    });


};

export const generateSmsOTP = async (phone) => {
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    await twilioClient.messages.create({
        body: `Your OTP for login is: ${generatedOTP}`,
        to: phone,
        from: twilioPhoneNumber,
    });
}



// const accountSid = "ACb86ccc631cb4500d0b20f96e6e7bb9bc";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = "VAbb9c84ca56d8e0cda23330772a91c184";
// const client = require("twilio")(accountSid, authToken)


// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+23409046807203", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+23409046807203", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });