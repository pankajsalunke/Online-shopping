import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Review from "../review/Review";
import loader from "../../assets/Search.gif";

const ShowProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/v1/products/products/${productId}`)
      .then((response) => {
        const data = response.data.data;
        // console.log(data);
        
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error while fetching product", error);
        setLoading(false);
      });
  }, [productId,]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-center mt-20 text-xl text-gray-500">
        <img src={loader} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Product Details Section */}
      <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="lg:w-1/2">
          <img
            src={product.productImage}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        <div className="lg:w-1/2 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          <div className="flex items-center mb-6">
            <span className="text-2xl font-semibold text-gray-900">
              ${product.price}
            </span>
            
          </div>
          <button
            onClick={() => navigate(`/category/${product.category._id}`)}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            View More in {product.category.C_name}
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-10">
        <Review id={product._id} />
      </div>
    </div>
  );
};

export default ShowProduct;
