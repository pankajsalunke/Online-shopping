import mongoose, { Schema } from "mongoose";


const orderItemSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }

    }, 
    {
        timestamps: true
    }
);




export const OrderItem = mongoose.model("OrderItem",orderItemSchema);