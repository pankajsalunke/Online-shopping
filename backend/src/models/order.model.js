import mongoose, { Schema } from "mongoose";


const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'shipped', 'delivered'],
            default: 'pending'
        },
        totalamount: {
            type: Number,
            required: true
        }
                            
    },
    {
        timestamps: true
    }
);




export const Order = mongoose.model("Order",orderSchema);