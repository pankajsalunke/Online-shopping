import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loader from "../../assets/Spinner-5.gif";
import { Button } from "../index.js";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [cartId, setCartId] = useState(''); // Store user's cartId
  const [message, setMessage] = useState(''); // To display messages

  // Check login status when component mounts
  useEffect(() => {
    axios
      .get("/api/v1/users/auth/check")
      .then((response) => {
        const { isLoggedIn } = response.data;
        setIsLoggedIn(isLoggedIn);
      })
      .catch((error) => {
        console.log(error?.response);
      });

    axios
      .get("/api/v1/products/allproducts")
      .then((response) => {
        const data = response.data.data;
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.data);
        setLoading(false);
      });
  }, [message]);

  // Fetch user's cartId
  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/v1/cart/cart'); // Fetch the user's cart
      setCartId(response.data.data._id); // Set the fetched cartId
      setLoading(false);
    } catch (err) {
      console.log(err.response ? err.response.data.message : 'Failed to fetch cart.');
      setLoading(false);
    }
  };

  // Fetch cart when component mounts
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart(); // Fetch cart only if logged in
    }
  }, [isLoggedIn]);

  // Handle Add to Cart functionality
  const handleAddToCart = async (productId) => {
    if (!cartId) {
      setMessage('No cart found. Please create one.');
      return;
    }

    try {
      const response = await axios.post(`/api/v1/cart/cart/${cartId}/${productId}/items`, {
        quantity: 1 // Set the quantity to 1 (or adjust as needed)
      });
      // console.log(response);
      setMessage('Product added to cart successfully.');
    } catch (error) {
      setMessage('Failed to add product to cart.');
      console.log(error.response ? error.response.data.message : 'Error adding product.');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-center mt-20 text-xl text-gray-500">
        <img src={loader} alt="Loading..." />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        {!isLoggedIn && (
          <div className="text-center mb-6">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        )}

        {/* Display message for adding product to cart */}
        {message && (
          <div className="text-center mb-4">
            <p className="text-green-600">{message}</p>
          </div>
        )}

        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
        </div>

        {/* Products List */}
        <ul className="flex flex-wrap -m-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4"
                key={product._id}
              >
                <div className="bg-gray-800 rounded-xl p-4 flex flex-col justify-between h-full shadow-lg">
                  <div className="flex flex-col items-center">
                    <img
                      src={product.productImage}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h2
                      className="text-gray-400 text-sm font-sans font-medium mb-2 cursor-pointer"
                      onClick={() =>
                        navigate(`/category/${product.category._id}`)
                      }
                    >
                      {product.category.C_name}
                    </h2>
                  </div>
                  <div className="text-center">
                    <h3
                      className="text-xl text-white cursor-pointer font-semibold mb-2"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">
                      {product.description}
                    </p>
                    <p className="text-gray-100 text-lg font-bold mb-1">
                      Price: ${product.price}
                    </p>
                    
                  </div>
                  <div>
                    <Button
                      onClick={() => handleAddToCart(product._id)}
                      className=""
                    >
                      🛒 Add To Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products available.</p>
          )}
        </ul>
      </div>
    </>
  );
}

export default Products;
