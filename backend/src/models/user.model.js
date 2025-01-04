import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,

        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,  //cloudanary url
            required: true,    
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        address: {
            type: String,
            required: true,

        },
        Mnumber: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            required: true
        },
        otp: {
            type: String,
        },
        otpExpires: {
            type: Date,
        },
        refreshToken: {
            type: String
        },

    },
    {
        timestamps: true
    })


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function ( password ) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
            Mnumber: this.Mnumber
        },
        process.env.ACCESS_TOKEN_SECRATE,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRATE,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User",userSchema);