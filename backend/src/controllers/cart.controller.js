import { Cart } from "../models/cart.model.js";
import {
    ApiError,
    ApiResponse,
    asyncHandler,    
} from '../utils/index.js'

const createCart = asyncHandler(async(req,res) => {
       try {
        const existingcart = await Cart.findOne({userId: req.user._id})
        if(existingcart) {
            return res.status(400).json({message: "Cart already exists."})
        }
        const cart = await Cart.create(
         {
             userId: req.user._id,
         })
         return res.status(201)
         .json( new ApiResponse(201,cart,"cart created successfully"))
       } catch (error) {
        throw new ApiError(500, "Something went Wrong while creating cart")        
       }

})

const getCart = asyncHandler(async(req,res) => {

    // console.log('Searching for cart with userId:', req.user._id);

      const cart = await Cart.findOne({userId: req.user._id}).populate("userId");
      
      if (!cart) {
        // console.log('Cart not found for userId:', req.user._id);
        return res.status(404).json({ message: 'Cart not found' });
      }
      return res.status(200)
      .json(new ApiResponse(
          200,
         cart,
          "Cart fetched successfully"
      ))   
  
})

const deleteCart = asyncHandler(async(req,res) => {
    // const {cartId} = req.params
    try {
        
        const deletecart = await Cart.findOneAndDelete({userId:req.user._id})
        if (!deletecart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return res.status(200)
        .json(new ApiResponse(200,"cart deleted"))
    }catch (error) {
        throw new ApiError(500,"Something went wrong")
    }
})
export {
    createCart,
    getCart,
    deleteCart
}