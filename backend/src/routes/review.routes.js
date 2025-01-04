import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createReview,
    updateReview,
    deleteReview,
    getProductReviews
} from '../controllers/review.controller.js'

const router = Router()
// router.use(verifyJWT)

router.post("/product/:productId/review", verifyJWT, createReview);
router.route('/review/:reviewId').patch(verifyJWT, updateReview)
router.route('/review/:reviewId').delete(verifyJWT, deleteReview)
router.route('/product/:productId/reviews').get(getProductReviews)


export default router