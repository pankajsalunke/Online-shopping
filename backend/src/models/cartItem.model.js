import mongoose, {Schema} from "mongoose";


const cartItemSchema = new Schema(
    {
        cartId: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,

        },
        quantity: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true
    }
)


export const CartItem = mongoose.model("CartItem",cartItemSchema);