import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/db.js';
import { stripeWebhooks } from './controllers/orderController.js';
import productRouter from './routes/ProductRoute.js';
import addressRouter from './routes/addressRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Allow multiple origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://green-cart-beryl.vercel.app/"
]


app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
//  Middleware configuration
app.use(express.json());
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => {
    res.send("API is running");
})

// Routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`.bgWhite.black);
});

await connectDB();
await connectCloudinary();