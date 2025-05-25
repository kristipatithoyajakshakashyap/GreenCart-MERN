import User from "../models/User.js";

//  update user cartData
export const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;
        await User.findByIdAndUpdate(userId, { cartItems })
        return res.status(200).json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error(`Error updating cart: ${error.message}`.bgRed.white);
        res.status(500).json({ message: "Internal Server Error" });

    }
}