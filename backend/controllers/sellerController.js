import jwt from 'jsonwebtoken';

// Login Seller
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('sellerToken', token, {
                httpOnly: true,  // Prevent JS to access the cookie
                secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.status(200).json({ success: true, message: "Logged in" });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(`Seller login error: ${error}`.bgRed.white);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Check if Seller is Authenticated
export const isSellerAuth = async (req, res) => {
    try {
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(`user isAuth error: ${error}`.bgRed.white);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Logout Seller
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,  // Prevent JS to access the cookie
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.error(`user logout error: ${error}`.bgRed.white);
        return res.status(500).json({ success: false, message: error.message });
    }
}