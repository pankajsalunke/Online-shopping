import { Payment } from '../models/payment.model.js';
import {Order} from '../models/order.model.js'

import {asyncHandler,ApiResponse,ApiError} from '../utils/index.js'




const createPayment = asyncHandler(async (req, res) => {
    try {
        const {orderId} = req.params
        const {  amount, paymentMethod, transactionId } = req.body;

        // Check if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Create payment
        const payment = await Payment.create({
            order: orderId,
            amount,
            paymentMethod,
            transactionId,
        });

        // if (payment.transactionId) {
        //    order.status.set({
        //     status: 'delivered',
        //    },
        // {new: true})
        // }

        return res.status(201).json(new ApiResponse(201, payment, "Payment created successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating payment");
    }
});



export {
    createPayment
}