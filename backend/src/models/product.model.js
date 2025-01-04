import mongoose, { Mongoose, Schema } from "mongoose";


const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        productImage: {
            type: String,
            required: true,
            required: true
        },
        price: {
            type: Number,
            default: 0,
            required: true
        },
        stockQty: {
            type: Number,
            default: 0
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ]
    },
    {
        timestamps: true
    }
)


export const Product = mongoose.model("Product",productSchema);