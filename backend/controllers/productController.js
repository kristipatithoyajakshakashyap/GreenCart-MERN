import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

// Add Product
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        )
        await Product.create({ ...productData, image: imagesUrl })
        return res.status(200).json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.error(`add product error: ${error}`.bgRed.white);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Get Product List
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        return res.status(200).json({ success: true, products });
    } catch (error) {
        console.error(`product list error: ${error}`.bgRed.white);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Get Product By ID
export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        return res.status(200).json({ success: true, product });
    } catch (error) {
        console.error(`product by ID error: ${error}`.bgRed.white);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Change Product inStock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock })
        return res.status(200).json({ success: true, message: "Product stock updated successfully" });
    } catch (error) {
        console.error(`change inStock error: ${error}`.bgRed.white);
        return res.status(500).json({ success: false, message: error.message });
    }
}