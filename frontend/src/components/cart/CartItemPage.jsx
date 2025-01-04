import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'; // Icons for actions

const CartItemPage = () => {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartId, setCartId] = useState(null);

    // Fetch Cart ID
    const fetchCart = async () => {
        try {
            const response = await axios.get('/api/v1/cart/cart');
            setCartId(response.data.data._id);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Failed to fetch cart.');
            setLoading(false);
        }
    };

    // Fetch cart items after cartId is set
    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (!cartId) return;

        const fetchCartData = async () => {
            try {
                const response = await axios.get(`/api/v1/cart/cart/${cartId}/items`);
                setCartData(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchCartData();
    }, [cartId]);

    // Handle loading state
    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
    }

    // Handle error state
    if (error) {
        return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    }

    // If no cart items found
    if (!cartData || cartData.length === 0) {
        return <div className="text-center text-gray-500 mt-10">Your cart is empty</div>;
    }

    return (
        <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Shopping Cart</h2>
            
            <div className="bg-white shadow-lg rounded-lg p-6">
                <p className="text-gray-700 font-semibold mb-4"><strong>User:</strong> {cartData.userName}</p>

                <table className="min-w-full table-auto border-collapse bg-white">
                    <thead>
                        <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6">Product Name</th>
                            <th className="py-3 px-6">Quantity</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartData.map((item) => (
                            <tr className="border-b border-gray-200 hover:bg-gray-100" key={item._id}>
                                <td className="py-3 px-6 text-gray-800 font-medium">{item.productId.name}</td>
                                <td className="py-3 px-6 text-center">{item.quantity}</td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        className="text-red-600 hover:text-red-800 mx-2"
                                        onClick={() => handleRemoveItem(item._id)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                    <button
                                        className="text-green-600 hover:text-green-800 mx-2"
                                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                    >
                                        <FiPlus />
                                    </button>
                                    <button
                                        className={`text-blue-600 hover:text-blue-800 mx-2 ${item.quantity === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                        disabled={item.quantity === 1}
                                    >
                                        <FiMinus />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-center mt-8">
                    <button
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

// Functions for handling cart actions
const handleRemoveItem = async (itemId) => {
    try {
        await axios.delete(`/api/v1/cart/item/${itemId}`);  // Adjust endpoint accordingly
        alert('Item removed successfully');
        window.location.reload(); // Refresh to update the cart
    } catch (err) {
        alert('Error removing item');
    }
};

const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
        await axios.put(`/api/v1/cart/item/${itemId}`, { quantity: newQuantity });
        window.location.reload(); // Refresh to update the cart
    } catch (err) {
        alert('Error updating quantity');
    }
};

const handleCheckout = () => {
    alert('Proceeding to checkout...');
};

export default CartItemPage;
