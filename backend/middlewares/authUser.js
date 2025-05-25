import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.body = req.body || {};
            req.body.userId = tokenDecode.id;
            next();
        } else {
            return res.status(401).json({ success: false, message: "Not Authorized" });
        }
    } catch (error) {
        console.error(`Middleware authUser error: ${error}`.bgRed.white);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export default authUser;