import mongoose, {Schema} from "mongoose";


const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        timestamps: true
    }
)



export const Cart = mongoose.model("Cart", cartSchema );