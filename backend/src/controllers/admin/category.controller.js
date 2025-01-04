import { Category } from "../../models/category.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";

const createCategory = asyncHandler(async (req, res) => {
  // console.log("req.body content :>:", req.body);

  const { C_name } = req.body;

  if (!C_name) {
    throw new ApiError(400, "category name are required");
  }

  const category = await Category.create({
    C_name: C_name,
  });

  // console.log("category name::", category);

  return res
    .status(201)
    .json(new ApiResponse(201, category, "category created successfully"));
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

const getCategoryById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "category fetched successfully !!"));
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { C_name } = req.body;
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        C_name,
      },
      {
        new: true,
      }
    );
    if (!updateCategory) {
      throw new ApiError(404, "category not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updateCategory, "category updated successfully !!")
      );
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while updating category name"
    );
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    // const { C_name } = req.body;
    // const delet = await Category.findOneAndDelete({C_name})
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(204).json(new ApiResponse(200, "category deleted"));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
