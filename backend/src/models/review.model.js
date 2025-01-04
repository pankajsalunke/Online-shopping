import mongoose, {Schema} from "mongoose";


const reviewSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
          },
        comment: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)


export const Review = mongoose.model("Review",reviewSchema);