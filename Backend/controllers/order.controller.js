import Order from "../models/order.model.js"; // Adjust the path as needed

export const placeOrder = async (req, res) => {
    try {
        const { customer, items, summary } = req.body;

        // Basic validation (optional - depends on how strict you want it)
        if (!customer || !items || !items.length || !summary) {
            return res.status(400).json({ message: "Missing order data." });
        }

        const order = await Order.create({
            customer,
            items,
            summary,
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message,
        });
    }
};
