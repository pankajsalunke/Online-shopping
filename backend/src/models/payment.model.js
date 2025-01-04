import mongoose, {Schema} from "mongoose";


const paymentSchema = new Schema(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,

        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,

        },
        transactionId: {
            type: String,
            required: true,

        }

    },
    {
        timestamps: true
    }
)


export const Payment = mongoose.model("Payment",paymentSchema);