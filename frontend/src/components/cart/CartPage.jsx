import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "../utils/Button";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Cart
  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/v1/cart/cart"); // Adjust endpoint accordingly
      setCart(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Failed to fetch cart."
      );
      setLoading(false);
    }
  };

  // Create Cart
  const createCart = async () => {
    try {
      const response = await axios.post("/api/v1/cart/cart"); // Adjust endpoint accordingly
      setCart(response.data.data);
      setSuccessMessage("Cart created successfully!");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Failed to create cart."
      );
    }
  };

  // Delete Cart
  const deleteCart = async () => {
    try {
      await axios.delete("/api/v1/cart/cart"); // Adjust endpoint accordingly
      setCart(null);
      setSuccessMessage("Cart deleted successfully!");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Failed to delete cart."
      );
    }
  };

  useEffect(() => {
    fetchCart();
  }, [successMessage]);

  return (
    <>
      <div className="cart-page p-6 max-w-4xl mx-auto h-96">
        <h2 className="text-2xl font-bold mb-4">Cart Management</h2>

        {loading && <p className="text-gray-500">Loading cart...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {successMessage && <p className="text-green-500">{successMessage}</p>}

        {!loading && !cart && (
          <div>
            <p className="mb-4">No cart found for the current user.</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={createCart}
            >
              Create Cart
            </button>
          </div>
        )}

        {cart && (
          <div className="mt-6">
            <p className="mb-4">Cart ID: {cart._id}</p>
            <p className="mb-4">User ID: {cart.userId._id}</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={deleteCart}
            >
              Delete Cart
            </button>
          </div>
        )}
        <div className="mt-4">
        <Button
        
        >
           <Link to={"/cartitems"}>CartItem Page</Link>
        </Button>
      </div>
      </div>
      
    </>
  );
};

export default CartPage;
