// Example UserAgent:
//
//

// this the function to get the device information using pre built regx
const getDeviceInfo = (userAgent) => {
    const isMobile = /mobile/i.test(userAgent);
    const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)/i)?.[0] || 'unknown';
    return {
        isMobile,
        browser
    };
};

module.exports = { getDeviceInfo };