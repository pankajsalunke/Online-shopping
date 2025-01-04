import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  getproductsByCategory,
  searchProduct,
  getAllCategories,
} from "../controllers/products.controller.js";

const router = Router();
// get all catgories
router.route("/products/category").get(getAllCategories);

// product routes

router.route("/allproducts").get(getAllProducts);

router.route("/products/:productId").get(getProductById);

router.route("/category/:categoryId").get(getproductsByCategory);

router.route("/search").get(searchProduct);

export default router;
