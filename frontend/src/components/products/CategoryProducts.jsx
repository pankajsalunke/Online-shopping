import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CategoryProducts = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    axios
      .get(`/api/v1/products/category/${categoryId}`)
      .then((response) => {
        const data = response.data.data
        setProducts(data);
      if (data.length > 0 && data[0].category) {
        setCategoryName(data[0].category.C_name);
      }
        setLoading(false);
        // console.log(response.data.data);
      })
      .catch((error) => {
        console.log("Error while fetching products for category", error);
      });
  }, [categoryId]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-center mt-20 text-xl text-gray-500">Loading...</div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>
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
                  <h3 className="text-xl text-white font-semibold mb-2 cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {product.description}
                  </p>
                  <p className="text-gray-100 text-lg font-bold">
                    Price: ${product.price}
                  </p>
                  <p className="text-yellow-400 text-sm">
                    Rating: {product.rating}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No products available for this category.
          </p>
        )}
      </ul>
    </div>
  );
};

export default CategoryProducts;
