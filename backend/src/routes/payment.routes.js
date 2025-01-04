import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createPayment
} from '../controllers/payment.controller.js'


const router = Router()

router.route("/payment/:orderId").post(verifyJWT, createPayment)



export default router