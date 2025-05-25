import Address from "../models/Address.js";

//  Add Address
export const addAddress = async (req, res) => {
    try {
        const { address, userId } = req.body;
        await Address.create({ ...address, userId });
        return res.status(201).json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.error(`Error adding address: ${error.message}`.bgRed.white);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//  Get Address
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        const addresses = await Address.find({ userId });
        if (!addresses) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        return res.status(200).json({ success: true, addresses });
    } catch (error) {
        console.error(`Error fetching address: ${error.message}`.bgRed.white);
        return res.status(500).json({ message: "Internal server error" });
    }
}