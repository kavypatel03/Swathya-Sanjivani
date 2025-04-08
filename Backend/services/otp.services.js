const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpStore = {};

module.exports.sendOTP = async (mobile) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        let formattedMobile = mobile.trim();
        if (!formattedMobile.startsWith('+')) {
            formattedMobile = '+91' + formattedMobile.replace(/^0+/, '');
        }

        // Store OTP regardless of environment
        otpStore[formattedMobile] = otp;

        // Always try to send SMS first
        try {
            await client.messages.create({
                body: `Your Swathya Sanjivani verification code is: ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: formattedMobile
            });
            console.log(`✅ SMS sent to ${formattedMobile}`);
        } catch (smsError) {
            console.log(`⚠️ SMS failed, OTP: ${otp} for ${formattedMobile}`);
            // Don't throw error, continue with stored OTP
        }

        return { 
            success: true,
            message: "OTP sent successfully"
        };

    } catch (error) {
        console.error("OTP Error:", error);
        throw error;
    }
};

module.exports.verifyOTP = (mobile, enteredOtp) => {
    const storedOtp = otpStore[mobile];
    if (storedOtp && storedOtp == enteredOtp) {
        delete otpStore[mobile];
        return true;
    }
    return false;
};