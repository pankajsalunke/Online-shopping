import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createCart,
    getCart,
    deleteCart,
} from '../controllers/cart.controller.js'

import {
    addItemToCart,
    getCartItems,
    updateCartItem,
    removecartItem
} from '../controllers/cartItem.controller.js'

const router = Router()

// cart routes

router.route('/cart')
.post(verifyJWT, createCart)
.get(verifyJWT,getCart)
.delete(verifyJWT, deleteCart)


// cart_Items routes
router.route('/cart/:cartId/:productId/items')
.post(verifyJWT, addItemToCart)

router.route('/cart/:cartId/items').get(verifyJWT, getCartItems)

router.route('/cart/:cartItemId/items')
.patch(verifyJWT, updateCartItem)
.delete(verifyJWT, removecartItem)


export default router