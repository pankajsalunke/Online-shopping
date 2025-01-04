import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addProduct } from "../controllers/admin/product.controller.js"
import { adminOnly } from "../middlewares/admin.middleware.js"
import { 
    createCategory, 
    deleteCategory, 
    getAllCategories,
    getCategoryById,
    updateCategory,
} from "../controllers/admin/category.controller.js"

const router = Router()
router.use(verifyJWT, adminOnly)

// Product related  admins routes 
router.route("/add-product").post( upload.single('productImage'), addProduct)


// category related admins routes
router.route("/add-category").post(createCategory)
router.route("/getcategories").get(getAllCategories)
router.route("/categories/:id")
.get(getCategoryById)
.patch(updateCategory)
.delete(deleteCategory)






export default router