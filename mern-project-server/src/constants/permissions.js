// we are going to use this in our middleware to protect outr endpoints
//-------- we have create this for the ROLE BASED ACCESS CONTROLE(RBAC)

const permissions ={
    admin:[
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'link:create',
        'link:read',
        'link:upddate',
        'link:delete',
    ],
    developers:[
        'link:read',
    ],
    viewer:[
        'link:read',
        'user:read',
    ]
};

module.exports = permissions;