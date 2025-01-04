
import { Order } from "../models/order.model.js";
// import { OrderItem } from "../models/orderIteme.model";
import {ApiResponse, asyncHandler} from '../utils/index.js'



const createOrder = asyncHandler(async (req,res) => {
    // const { userId } = req.params;
    const userId = req.user._id;
    const {totalamount, status } = req.body;
    
    const order = await Order.create({
        userId,
        totalamount,
        status
    })
    return res.status(201).json(new ApiResponse(200,order,"order created successfully" ))
     
})
const getOrderById = asyncHandler(async (req,res) => {
    const {orderId} = req.params
    const order = await Order.findById(orderId).populate('userId');

    if (!order) {
        return res.status(404).json({message: "Order Not Found"})
    }
    return res.status(200)
    .json(new ApiResponse(200,order,"order fetched successfully"))
})

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find().populate('userId');
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders', error });
    }
})

const updateOrderStatus = asyncHandler( async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order', error });
    }
})

const deleteOrder = asyncHandler( async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting order', error });
    }
})


export {
    createOrder,
    getOrderById
}