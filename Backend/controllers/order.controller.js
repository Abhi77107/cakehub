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

export const fetchRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: "Fetched recent orders successfully",
            orders: recentOrders,
        });

    } catch (error) {
        console.error("Error fetching recent orders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent orders",
            error: error.message,
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order,
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message,
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message,
        });
    }
};