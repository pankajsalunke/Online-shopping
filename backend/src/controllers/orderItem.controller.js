import { OrderItem } from '../models/orderIteme.model.js';

import {ApiResponse, asyncHandler} from '../utils/index.js'

const createOrderItem = asyncHandler(async (req, res) => {
    try {
        const { orderId,productId } = req.params
        const { quantity, price } = req.body;
        
        const orderItem = await OrderItem.create({
            orderId,
            productId,
            quantity,
            price
        });
        
        res.status(201).json(orderItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adding order item', error });
    }
})

const getItemsByOrderId = asyncHandler( async (req, res) => {
    try {
        const orderItems = await OrderItem.find({ orderId: req.params.orderId })
            .populate('productId')
            .populate('orderId');
            
        res.status(200).json(orderItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order items', error });
    }
})

const updateOrderItem = asyncHandler( async (req, res) => {
    try {
        const { quantity, price } = req.body;
        const orderItem = await OrderItem.findByIdAndUpdate(
            req.params.id,
            { quantity, price },
            { new: true }
        );
        
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        
        res.status(200).json(orderItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order item', error });
    }
})

const deleteOrderItem = asyncHandler( async (req, res) => {
    try {
        const orderItem = await OrderItem.findByIdAndDelete(req.params.id);
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        res.status(200).json({ message: 'Order item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order item', error });
    }
})

export {
    createOrderItem,
}