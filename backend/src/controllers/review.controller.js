import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { isValidObjectId } from "mongoose";

const createReview = asyncHandler(async (req, res) => {
  const {  rating, comment } = req.body;
  const { productId } = req.params;
  const userId = req.user._id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    // if (!product.reviews) {
    //   product.reviews = [];
    // }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating: rating,
      comment: comment,
    });
    // Add the review to the product's reviews array
    // console.log(review);
    
    product.reviews.push(review._id);
    await product.save();
    if (!review) {
      throw new ApiError(500, "something went wrong while creating review");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, review, "review is created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { reviewId } = req.params;
  // const userId = req.user._id;

  if (!rating && !comment) {
    throw new ApiError(404, "All field are required");
  }
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          rating: rating,
          comment: comment,
        },
      },
      { new: true }
    );
    if (!review) {
      throw new ApiError(400, "something went wrong while updating review");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, review, "Review updated successfull"));
  } catch (error) {
    throw new ApiError(500, "something went wrong while updating review");
  }
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  if (!isValidObjectId(reviewId)) {
    throw new ApiError(401, "Invalid reviewId.");
  }
  try {
    await Product.findByIdAndUpdate(reviewId.product, {
      $pull: { reviews: reviewId },
    });
    const response = await Review.findByIdAndDelete(reviewId);

    if (!response) {
      res.status(404).json({message:"Review not found"});
    }
    return res
      .status(201)
      .json(new ApiResponse(200, response, "Review deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deleting review");
  }
});

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }
  const product = await Product.findById(productId).populate({
    path: "reviews",
    populate:
     { path: "user", select: "username avatar" }, // Populate user details in reviews
  });
  

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product.reviews, "Reviews fetched successfully"));
 
});

export { 
  createReview,
  updateReview, 
  deleteReview, 
  getProductReviews
};

