import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import { User } from "../../models/user.model.js";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  uploadOnCloudinary
} from '../../utils/index.js'

// Admin : add a new product

const addProduct = asyncHandler(async (req,res) => {
    const { name, price, description, stockQty, categoryin} = req.body;

    if ([name, price, description, stockQty].some(
        (field) => field?.trim() === ""
      )) {
        throw new ApiError(400, "All fields are required");
      }
// console.log("input category name::", categoryin);

      const category = await Category.findOne({C_name:categoryin})
    
    //   console.log("founded category::" ,category);
      
      if (!category) {
        throw new ApiError(404, "Category not found");
      }
    
    //   console.log("category Id::",category_id);  
    const producImageLocalPath = req.file?.path;
    // console.log("product local path::",producImageLocalPath);
    
    if(!producImageLocalPath){
        throw new ApiError(400, "Product image is required");
    }
    const productImage = await uploadOnCloudinary(producImageLocalPath) 

    // console.log("product cloudinary image::",productImage);

    if (!productImage) {
        throw new ApiError(400, "Product image is required");
    }

    const product = await Product.create({
        name,
        price,
        description,
        category:category._id,
        stockQty,
        productImage: productImage.url
    })

    // console.log("created Product::",product);
    return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));

}) 

export {
    addProduct,

}