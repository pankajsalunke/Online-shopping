import { Router } from "express"
import { 
    logInUser, 
    registerUser, 
    logoutUser,
    changeCurrentPassword ,
    getCurrentUser,
    updateUserAvatar,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    checkUserLoggedIn
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"




const router = Router()

router.route("/register").post( upload.single('avatar'), registerUser)
router.route("/login").post(logInUser)
router.route("/auth/check").get(checkUserLoggedIn)

// secure routes

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/get-user").get(verifyJWT,getCurrentUser)
router.route("/updateprofileimage").patch(verifyJWT,upload.single('avatar'),updateUserAvatar)
router.route("/updateuserprofile").patch(verifyJWT,updateUserProfile)
router.route("/forgotpass")
.post(verifyJWT,forgotPassword)
router.route("/resetpass").post(verifyJWT,resetPassword)

export default router