const otpService = require('../services/otp.services');

exports.sendOtp = async (req, res) => {
    try {
        const { mobile, userType = 'Patient' } = req.body;
        
        if (!mobile) {
            return res.status(400).json({ 
                success: false, 
                message: "Mobile number is required" 
            });
        }

        const result = await otpService.sendOTP(mobile, userType);
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error("Error in sendOtp controller:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to send OTP" 
        });
    }
};

exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: "Mobile and OTP are required." 
        });
    }

    try {
        const isVerified = otpService.verifyOTP(mobile, otp);
        if (isVerified) {
            res.status(200).json({ 
                success: true, 
                message: "OTP verified successfully." 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: "Invalid OTP." 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};