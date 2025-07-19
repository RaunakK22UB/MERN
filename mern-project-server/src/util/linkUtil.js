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

//https://wonderful-lamington-c5be41.netlify.app/
// backend:-
//https://dashboard.render.com/web/srv-d1t14djuibrs738p5kd0/deploys/dep-d1t75fp5pdvs73d9n7j0