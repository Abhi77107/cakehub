import express from 'express';
import { placeOrder, fetchRecentOrders, getOrderById, updateOrderStatus } from '../controllers/order.controller.js';

const orderRouter = express.Router();

orderRouter.post('/', placeOrder);
orderRouter.get('/recent', fetchRecentOrders);
orderRouter.get('/:orderId', getOrderById);
orderRouter.patch('/:orderId/status', updateOrderStatus);

export default orderRouter;