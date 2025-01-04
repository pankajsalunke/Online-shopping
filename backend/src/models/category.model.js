import mongoose, { Schema } from "mongoose";


const categorySchema = new Schema(
    {
        C_name: {
            type: String,
            required: true
        }        
    },
    {
        timestamps: true   
    }
)


export const Category = mongoose.model("Category",categorySchema);