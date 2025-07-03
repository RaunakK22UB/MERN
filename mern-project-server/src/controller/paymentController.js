// step number 1 and number 7 from the sequence diagram of one-time payment workflow
const Razorpay = require('razorpay');
const CREDIT_PACKS = require("../constants/paymentConstant");
const crypto = require('crypto');
const Users = require('../model/Users');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET // ✅ fixed: it was incorrectly written as KEY_SECRET
});

const paymentController = {
    // Step #1 from the sequence diagram of one-time payment workflow
    // ✅ We are here creating the first step when the user initiates the payment
    createOrder: async (request, response) => {
        try {
            const { credits } = request.body;

            if (!CREDIT_PACKS[credits]) { // ✅ check if credits pack is valid
                return response.status(400).json({
                    message: 'Invalid credit value'
                });
            }

            const amount = CREDIT_PACKS[credits] * 100; // ✅ convert to paisa (Razorpay needs amount in paise)

            const order = await razorpay.orders.create({
                amount: amount,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });

            response.json({
                order: order
            });

        } catch (error) {
            console.log(error);
            response.status(500).json({ // ✅ fixed typo: staus → status
                message: 'Internal server error'
            });
        }
    },

    // Step #7 from the sequence diagram of one-time payment workflow
    // ✅ Verify payment and update user credits
    verifyOrder: async (request, response) => {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                credits
            } = request.body;

            const body = razorpay_order_id + "|" + razorpay_payment_id;

            // ✅ generate expected signature
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return response.status(400).json({
                    message: 'Signature verification failed'
                });
            }

            // ✅ add credits to user
            const user = await Users.findById(request.user.id);
            if (!user) {
                return response.status(404).json({
                    message: 'User not found'
                });
            }

            user.credits += Number(credits); // ✅ safely increment credits
            await user.save();

            response.json({
                user: user
            });

        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    }
};

module.exports = paymentController; // ✅ fixed typo: modulr → module
