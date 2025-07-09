export const CREDIT_PACKS = [50, 100, 200, 500];   // this credit to manoy value pairs 10 credits means 10 rupee

export const PLAN_IDS = {
    UNLIMITED_YEARLY: {
        id:'plan_Qq8G0G08Fg8viY',
        planName: 'Unlimited Yearly',
        description:'Yearly subscription,2months free',
        totalBillingCycleCount: 5
    },
    UNLIMITED_MONTHLY: {
        id: 'plan_Qq8C7TTwwT9lDg',
        planName: 'Unlimited Monthly',
        description:'Monthly subscription',
        totalBillingCycleCount: 12
    }
};


export const pricingList=[
    {
        price:"Credit Packs",
        list:[
            {details:"10 CREDITS FOR ₹10",},
            {details:"20 CREDITS FOR ₹20",},
            {details:"50 CREDITS FOR ₹50",},
            {details:"100 CREDITS FOR ₹100",}
        ],
    },
     {
        price:"Unlimited Monthly",
        list:[
            {details:"Unlimited LINKS",},
            {details:"AUTO RENEWED",},
            {details:"CHARGED MONTHLY",},
            {details:"CANCEL ANYTIME",}
        ],
    },
     {
        price:"Unlimited YEARLY",
        list:[
            {details:"Unlimited LINKS",},
            {details:"AUTO RENEWED",},
            {details:"CHARGED YEARLY",},
            {details:"CANCEL ANYTIME",}
        ],
    },

];