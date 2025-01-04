import { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { 
  asyncHandler, 
  ApiError, 
  ApiResponse 
} from "../utils/index.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
  .populate({
    path: 'reviews', 
    populate: { path: 'user', select: 'username' } 
  })
  .populate("category");

  if (!products) {
    throw new ApiError(404, "Products not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "All Products are fetched successfully")
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    throw new ApiError(404, "product not found or invalid object ID");
  }
  const product = await Product.findById(productId)
  .populate({
    path: 'reviews', // Populate the reviews field
    populate: { path: 'user', select: 'username ' } // Populate the user field within reviews, selecting only the user's name
  })
  .populate("category");
  if (!product) {
    throw new ApiError(404, "product not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, product, "Product is fetched successfully"));
});

const getproductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const products = await Product.find({ category: categoryId }).populate(
    "category"
  );
  if (!products) {
    throw new ApiError(404, "Products not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products are fetched successfully"));
});

const searchProduct = asyncHandler(async (req, res) => {
  const search = req.query.q;

  if (!search) {
    return res
      .status(400)
      .json(new ApiResponse(400, [], "Search query missing"));
  }
  const products = await Product.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  }).populate("category");

  if (!products) {
    throw new ApiError(404, "produc not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "fetched successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    throw new ApiError(404, "categories not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, "All categories fetched successfully !!")
    );
});

export {
  getAllProducts,
  getProductById,
  getproductsByCategory,
  searchProduct,
  getAllCategories,
};
