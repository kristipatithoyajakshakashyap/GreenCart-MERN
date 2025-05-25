import stripe from 'stripe';
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Place order COD
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length == 0) {
            return res.status(400).json({ success: false, message: "Invalid Data" });
        }
        // Calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);
        // add tax charge (2%)
        amount += Math.floor(amount * 0.02);
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        })
        return res.status(201).json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.error(`Error placing order: ${error.message}`.bgRed.white);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Place order stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;
        if (!address || items.length == 0) {
            return res.status(400).json({ success: false, message: "Invalid Data" });
        }
        let productData = [];
        // Calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);
        // add tax charge (2%)
        amount += Math.floor(amount * 0.02);
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        //  stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        // create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })
        //  create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.status(201).json({ success: true, url: session.url });
    } catch (error) {
        console.error(`Error placing order: ${error.message}`.bgRed.white);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Stripe Webhooks to Verify Payments Action
export const stripeWebhooks = async (req, res) => {
    //  stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers["stripe-signature"];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return Response.status(400).send(`Webhook Error: ${error.message}`)
    }
    //  Handle the event
    switch (Event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const { orderId, userId } = session.data[0].metadata;
            //  Make payment as paid
            await Order.findByIdAndUpdate(orderId, { isPaid: true })
            await User.findByIdAndUpdate(userId, { cartItems: {} })
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`)
            break;
    }
    response.status(200).json({ received: true })
}

// Get Orders by UserId
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId
        }).populate("items.product address").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(`Error fetching user orders: ${error.message}`.bgRed.white);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get all orders for admin/ seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("items.product address").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(`Error fetching admin/seller orders: ${error.message}`.bgRed.white);
        res.status(500).json({ message: "Internal server error" });
    }
}
