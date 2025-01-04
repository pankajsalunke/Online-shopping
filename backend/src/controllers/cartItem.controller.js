import { isValidObjectId } from 'mongoose';
import {CartItem} from '../models/cartItem.model.js'
import mongoose from 'mongoose';
import {
    ApiError,
    ApiResponse,
    asyncHandler,    
} from '../utils/index.js'

const addItemToCart = asyncHandler(async(req,res) => {
    const { quantity } = req.body;
    const {cartId , productId} = req.params;
   
    if (!isValidObjectId(cartId)) {
        return res.json({message:"not a valid object ID"})
    }
    if (!quantity) {
        throw new ApiError(400, 'Quantity is required');
    }
    const cartItem = await CartItem.create({
        cartId,
        productId,
        quantity
    });
    if (!cartItem) {
        throw new ApiError(404, 'Cart item not found');
    }
    return res.status(201)
    .json(new ApiResponse(200,
        cartItem,
        "Item added to cart"
    ))
})
// const addItemToCart = async (req, res) => {
//     try {
//       const cartItemData = {
//         cartId: new mongoose.Types.ObjectId(req.body.cartId),  // Convert to ObjectId
//         productId: new mongoose.Types.ObjectId(req.body.productId),
//         quantity: req.body.quantity,
//       };
  
//       const newCartItem = await CartItem.create(cartItemData);
//       res.status(201).json({message:"added Successffully", newCartItem:newCartItem});
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };
  

  const getCartItems = asyncHandler(async (req, res) => {
    const { cartId } = req.params;
// console.log(cartItemId);

    // Validate cartId
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ status: "400", message: "Invalid Cart ID" });
    }

    // Find cart items by cartId and populate related product details
    const cartItems = await CartItem.find({ cartId })
        .populate({
            path: 'productId',  // Field in CartItem that references Product
            select: 'name price',  // Only select the product's name and price
        });

    // Check if any cart items were found
    if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({ status: "404", message: 'Cart items not found' });
    }

    // Return success response with cart items
    return res.status(200).json(new ApiResponse(200, cartItems, "Cart items fetched successfully"));
});


const updateCartItem = asyncHandler(async(req, res) => {
    const { quantity } = req.body;
    const { cartItemId } = req.params;
    const updateCartItem = await CartItem.findOneAndUpdate(
        {_id: cartItemId},
        { $set: { quantity } },
        { new: true }
    )
    if (!updateCartItem) {
        res.json({message:"Cart Item not found"})
    }
    return res.status(200)
    .json(new ApiResponse(200,
        updateCartItem,
        "Cart item updated successfully"
        ))
})

const removecartItem = asyncHandler(async(req,res) => {
 
    const cartItem = await CartItem.findOneAndDelete({_id: req.params.cartItemId})
    if (!cartItem) {
        return res.status(404).json({ message: 'CartItem not found' });
    }
    return res.status(200)
    .json(new ApiResponse(201,
        {},
        "Cart item removed successfully"
    ))
})
export {
    addItemToCart,
    getCartItems,
    updateCartItem,
    removecartItem
}