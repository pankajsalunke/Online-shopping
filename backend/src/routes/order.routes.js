import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createOrder,
    getOrderById
} from '../controllers/order.controller.js'
import {
    createOrderItem,

} from '../controllers/orderItem.controller.js'

const router = Router()

// order routes
router.route("/order").post( verifyJWT, createOrder);

router.route("/order/:orderId").get(verifyJWT,getOrderById)


// orderItem Routes
router.route("/orderItem/:orderId/:productId").post( verifyJWT, createOrderItem);



export default router