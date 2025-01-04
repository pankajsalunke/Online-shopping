import nodemailer from 'nodemailer'
import twilio from 'twilio';

// using mail
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            
            user:process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
        // host: 'smtp.ethereal.email',
        // port: 587,
        // auth: {
        //     user:process.env.EMAIL_USER,
        //     pass: process.env.EMAIL_PASSWORD
        //  }
    })
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your password reset OTP',
        text: `Your OTP for password reset is ${otp}, It will expires in 10 minute`
    }
    await transporter.sendMail(mailOptions)
}

// using mobile number

const sendOTPSMS = async (Mnumber,otp) => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
        body: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobileNumber
    });
}

export {
    sendOTPEmail,
}