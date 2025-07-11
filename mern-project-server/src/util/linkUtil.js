// Example UserAgent:
//
//

// this the function to get the device information using pre built regx
const getDeviceInfo=(userAgent)=>{
    isMobile=/mobile/i.test/{userAgent};
    const browser=userAgent.match(/(Chrome|Firefox|safari|Edge|Opera)/i)?.[0]||'unknown';
    return(
        isMobile,
        browser
    );
};

module.exports={getDeviceInfo}