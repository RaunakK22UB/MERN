const { request } = require("express");
const Links = require("../model/Links");
const Users = require("../model/Users");
const axios= require('axios');
const {getDeviceInfo} = require("../util/linkUtil");
const Clicks = require("../model/Clicks");
const { generateUploadSignature } = require("../service/cloudinaryService");

const linksController = {
    create: async (request, response) => {
        const { campaign_title, original_url, category, thumbnail } = request.body;

        try {
            // We're fetching user details from DB even though we have
            // it available in request object. The reason is critical operation.
            // We're dealing with money and we want to pull latest information
            // whenever we're transacting.


            const user = await Users.findById({ _id: request.user.id });
            console.log(user.Subscription.status);
            // we 1st found the user by id then we are seeing if they have active subscription and credit should be also so there so can create link
            const hasActiveSubscription = user.Subscription && user.Subscription.status === 'active';
            if (!hasActiveSubscription && user.credits < 1) {
                return response.status(400).json({
                    messsage: 'Insufficient credit balance or no active subscription'
                });
            }


            const link = new Links({
                campaignTitle: campaign_title,
                originalUrl: original_url,
                category: category,
                thumbnail :thumbnail ,
                // users: request.user.id // Coming from middleware; AuthMiddleware
                users: request.user.role === 'admin' ?
                    request.user.id : request.user.adminId 
            });
            await link.save();

            // if the user dont have the subscription then we will just decrease the credits because in yearly and monthaly credits are unlimited
            if (!hasActiveSubscription) {
                user.credits -= 1;   // we are decrementing the value of credit because they making of url code is above only
                await user.save();
            }


            response.json({
                data: { linkId: link._id }
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                error: 'Internal server error'
            });
        }
    },
// ------------------------------------------------now we are goint to sdd the paggination logic  starting from getAll
    getAll: async (request, response) => {
        try {

            // for pagination params , will coem like current page number, page size
            const {
                currentPage = 0, pageSize=0,
                searchQuery='',//serching
                sortField='createdAt',//sorting
                sortOrder='desec' //sorting
            }= request.query;
             
        // now to search we had to create the mongodb querry
            const userId = request.user.role === 'admin' ?
                request.user.id : request.user.adminId; 


            const skip = parseInt(currentPage) * parseInt(pageSize);
            const limit = parseInt(pageSize);
            const sort = {[sortField]: sortOrder === 'desc'?-1:1};

            // creating the querry
            const query={
                users:userId

            };

            if(searchQuery){
                query.$or=[
                    {campaignTitle: new RegExp(searchQuery,'i')},
                    {originalUrl: new RegExp(searchQuery,'i')},
                    {category: new RegExp(searchQuery,'i')},
                ]
            }

            const links = await Links
                .find(query) 
                .sort(sort).skip(skip).limit(limit);

                const total = await Links.countDocuments(query)
            response.json({ links,total });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    getById: async (request, response) => {
        try {
            const linkId = request.params.id;
            if (!linkId) {
                return response.status(401)
                    .json({ error: 'Link ID is required' });
            }

            const link = await Links.findById(linkId);
            if (!link) {
                return response.status(404)
                    .json({ error: 'LinkID does not exist' });
            }

            // Make sure the link indeed belong to the logged in user.
            const userId = request.user.role === 'admin' ?
                request.user.id : request.user.adminId; 

            if (link.users.toString() !== userId) {
                return response.status(403).json({
                    error: 'Unauthorized access'
                });
            }

            response.json({ data: link });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    update: async (request, response) => {
        try {
            const linkId = request.params.id;
            if (!linkId) {
                return response.status(401)
                    .json({ error: 'Link ID is required' });
            }

            let link = await Links.findById(linkId);
            if (!link) {
                return response.status(404)
                    .json({ error: 'LinkID does not exist' });
            }

            // Make sure the link indeed belong to the logged in user.
            const userId = request.user.role === 'admin' ?
                request.user.id : request.user.adminId; 

            if (link.users.toString() !== userId) { 
                return response.status(403).json({
                    error: 'Unauthorized access'
                });
            }

            const { campaign_title, original_url, category, thumbnail } = request.body;
            link = await Links.findByIdAndUpdate(linkId, {
                campaignTitle: campaign_title,
                originalUrl: original_url,
                category: category,
                thumbnail :thumbnail 
            }, { new: true }); // new: true flag makes sure mongodb returns updated data after the update operation

            // Return updated link data
            response.json({ data: link });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    delete: async (request, response) => {
        try {
            const linkId = request.params.id;
            if (!linkId) {
                return response.status(401)
                    .json({ error: 'Link ID is required' });
            }

            let link = await Links.findById(linkId);
            if (!link) {
                return response.status(404)
                    .json({ error: 'LinkID does not exist' });
            }

            // Make sure the link indeed belong to the logged in user.
            const userId = request.user.role === 'admin' ?
                request.user.id : request.user.adminId;

            if (link.users.toString() !== userId) { 
                return response.status(403).json({
                    error: 'Unauthorized access'
                });
            }

            await link.deleteOne();
            response.json({ message: 'Link deleted' });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                error: 'Internal server error'
            });
        }
    },
    

    redirect: async (request, response) => {
        try {
            const linkId = request.params.id;
            if (!linkId) {
                return response.status(401)
                    .json({ error: 'Link ID is required' });
            }

            let link = await Links.findById(linkId);
            if (!link) {
                return response.status(404)
                    .json({ error: 'LinkID does not exist' });
            }
//---------------------------------------------------------------scraping the data ip,city,country,region,lat,lon,isp
            const isDevelopment=process.env.NODE_ENV === "development";
            const ipAddress=isDevelopment ? '8.8.8.8' : request.headers['x-forwarded-for']?.split(',')[0] || request.socket.remoteAddress;

            const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            const {city,country,region,lat,lon,isp}=geoResponse.data;

            const userAgent=request.headers['user-agent']||'unknown';
            const {isMobile,browser} = getDeviceInfo(userAgent);
            const deviceType = isMobile?'Mobile':'Desktop';
            const referrer = request.get('Referrer')||null;

            await Clicks.create({
                linkID:link._id,
                ip:ipAddress,
                city:city,
                country:country,
                region:region,
                latitude:lat,
                longitude:lon,
                isp:isp,
                referrer:referrer,
                userAgent:userAgent,
                deviceType:deviceType,
                browser:browser,
                clickedAt:new Date()
            });
//-------------------------------------------------------------------------------------------------------------------
            link.clickCount += 1;
            await link.save();

            response.redirect(link.originalUrl);
        } catch (error) {
            console.log(error);
            response.status(500).json({
                error: 'Internal server error'
            });
        }
    },


    // this analytics function to take all the data from redirect function related to clicks

    analytics:async(request,response)=>{
        try{
            const {linkId,from,to}=request.query;
            const link = await Links.findById({_id:linkId});
            if(!link){
                return response.status(404).json({
                    error:'Link not found'
                });
            }
 
            const userId=request.user.role === 'admin'?request.user.id:request.user.adminId
            if(link.users.toString()!==userId){
                return response.status(403).json({
                    error:"Unauthorised"
                });
            }

            const query ={
                linkID:linkId
            };

            if(from && to ){
                query.clickedAt = {$gte : new Date(from), $lte: new Date(to)};
            }
            const data = await Clicks.find(query).sort({clickedAt:-1});
            response.json(data);

        }catch(error){
            console.log(error);
            response.status(400).json({
                message:"Internal server error"
            });
        }
    },
// ----------------the server is going to create a temprory signature for cloudinary to verify this signature
    createUploadSignature: async(request,response)=>{
        try{
            const {signature,timestamp}=generateUploadSignature();
            response.json({
                signature:signature,
                timestamp:timestamp,
                apiKey:process.env.CLOUDINARY_API_KEY,
                cloudName:process.env.CLOUD_NAME

            })

        }catch(error){
            response.status.json({message:'Internal server error'})
        }
    }
};

module.exports = linksController;

// -----------------last changes 1-7-2025

// const { request } = require("express");
// const Links = require("../model/Links");

// const linksController = {
//     create: async (request, response) => {
//         const { campaign_title, original_url, category } = request.body;

//         try {
//             const link = new Links({
//                 campaignTitle: campaign_title,
//                 originalUrl: original_url,
//                 category: category,
//                 // users: request.user.id // Coming from middleware; AuthMiddleware
//                 users: request.user.role === 'admin'?
//                 request.user.id : request.user.adminId
//             });
//             await link.save();
//             response.json({
//                 data: { linkId: link._id }
//             });
//         } catch (error) {
//             console.log(error);
//             response.status(500).json({
//                 error: 'Internal server error'
//             });
//         }
//     },

//     getAll: async (request, response) => {
//         try {
//             const userId = request.user.role ==='admin'?
//             request.user.id : request.user.adminId      // agar to ' admin' hai to uska id lelo nahi to jo uska adminId hai vo lelo
//             const links = await Links
//                 .find({ users: request.user.id })
//                 .sort({ createdAt: -1 });
//             response.json({ data: links });
//         } catch (error) {
//             console.log(error);
//             response.status(500).json({
//                 error: 'Internal server error'
//             });
//         }
//     },

//     getById: async (request, response) => {
//         try {
//             const linkId = request.params.id;
//             if (!linkId) {
//                 return response.status(401)
//                     .json({ error: 'Link ID is required' });
//             }

//             const link = await Links.findById(linkId);
//             if (!link) {
//                 return response.status(404)
//                     .json({ error: 'LinkID does not exist' });
//             }

//             // Make sure the link indeed belong to the logged in user.
//             if (link.users.toString() !== request.user.id) {
//                 return response.status(403).json({
//                     error: 'Unauthorized access'
//                 });
//             }

//             response.json({ data: link });
//         } catch (error) {
//             console.log(error);
//             response.status(500).json({
//                 error: 'Internal server error'
//             });
//         }
//     },

//     update: async (request, response) => {
//         try {
//             const linkId = request.params.id;
//             if (!linkId) {
//                 return response.status(401)
//                     .json({ error: 'Link ID is required' });
//             }

//             let link = await Links.findById(linkId);
//             if (!link) {
//                 return response.status(404)
//                     .json({ error: 'LinkID does not exist' });
//             }

//             // Make sure the link indeed belong to the logged in user.
//             if (link.users.toString() !== request.user.id) {
//                 return response.status(403).json({
//                     error: 'Unauthorized access'
//                 });
//             }

//             const { campaign_title, original_url, category } = request.body;
//             link = await Links.findByIdAndUpdate(linkId, {
//                 campaignTitle: campaign_title,
//                 originalUrl: original_url,
//                 category: category
//             }, { new: true }); // new: true flag makes sure mongodb returns updated data after the update operation

//             // Return updated link data
//             response.json({ data: link });
//         } catch (error) {
//             console.log(error);
//             response.status(500).json({
//                 error: 'Internal server error'
//             });
//         }
//     },

//     delete: async (request, response) => {
//         try {
//             const linkId = request.params.id;
//             if (!linkId) {
//                 return response.status(401)
//                     .json({ error: 'Link ID is required' });
//             }

//             let link = await Links.findById(linkId);
//             if (!link) {
//                 return response.status(404)
//                     .json({ error: 'LinkID does not exist' });
//             }

//             // Make sure the link indeed belong to the logged in user.
//             if (link.users.toString() !== request.user.id) {
//                 return response.status(403).json({
//                     error: 'Unauthorized access'
//                 });
//             }

//             await link.deleteOne();
//             response.json({ message: 'Link deleted' });
//         } catch (error) {
//             console.log(error);
//             response.status(500).json({
//                 error: 'Internal server error'
//             });
//         }
//     },

//     redirect: async (request, response) => {
//         try {
//             const linkId = request.params.id;
//             if (!linkId) {
//                 return response.status(401)
//                     .json({ error: 'Link ID is required' });
//             }

//             let link = await Links.findById(linkId);
//             if (!link) {
//                 return response.status(404)
//                     .json({ error: 'LinkID does not exist' });
//             }

//             link.clickCount += 1;
//             await link.save();

//             response.redirect(link.originalUrl);
//         } catch (error) {
//             console.log(error);
//             response.status(500).json({
//                 error: 'Internal server error'
//             });
//         }
//     },
// };

// module.exports = linksController;