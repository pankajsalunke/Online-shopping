import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import loader from '../../assets/Search.gif'

const SearchProduct = () => {

    const navigate = useNavigate()
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)
    const q = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        if (q) {
            axios.get(`/api/v1/products/search?q=${q}`)
            .then(response => {
                const data = response.data.data;
                setProducts(data);
                // console.log(data);
                
                setLoading(false)

            })
            .catch(error => {
                console.log("Error while fetching results",error);
                });
        }
    },[q])
    if (loading) {
        return <div className="h-screen flex justify-center items-center text-center mt-20 text-xl text-gray-500"><img src={loader} alt="Loading..." /></div>;
    }

  return (
    <>
    <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Products</h1>
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
                <h3 className="text-xl text-white cursor-pointer font-semibold mb-2"
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
        <p className="text-gray-500">No products available.</p>
      )}
    </ul>
  </div>
  
  </>
  )
}

export default SearchProduct