const formatMobileNumber = (mobile) => {
    if (!mobile) return null;
    
    // Remove all spaces and special characters except +
    mobile = mobile.replace(/[^\d+]/g, '');
    
    // If number already starts with +91, return as is
    if (mobile.startsWith('+91')) {
        return mobile;
    }
    
    // If number starts with 91, add +
    if (mobile.startsWith('91')) {
        return '+' + mobile;
    }
    
    // For all other cases, add +91
    return '+91' + mobile.replace(/^0+/, ''); // Remove leading zeros if any
};

module.exports = formatMobileNumber;
