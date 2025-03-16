const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpStore = {};  // Temporary OTP storage (use database for better security)

module.exports.sendOTP = async (mobile) => {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    otpStore[mobile] = otp;

    try {
        const response = await client.messages.create({
            body: `Your Swathya Sanjivani OTP for Registration is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${mobile}`
        });
        return { success: true, otp };
    } catch (error) {
        console.error("❌ Error sending OTP:", error.message);
        throw new Error("Failed to send OTP. Please try again.");
    }
};


module.exports.verifyOTP = (mobile, enteredOtp) => {
    if (otpStore[mobile] && otpStore[mobile] == enteredOtp) {
        delete otpStore[mobile];  // Remove OTP after successful verification
        return true;
    }
    return false;
};
