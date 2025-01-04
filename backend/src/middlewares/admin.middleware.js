import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminOnly = asyncHandler(async (req, _, next) => {
    const user = await User.findById(req.user.id).select("-password");
    
    // console.log("User from admin Midlleware::",user,"user.role::",user.role);
    
    if(user.role === "admin") {
        next()
    }else {
        throw new ApiError(403, "You are not authorized to access this route")
    }

})

 