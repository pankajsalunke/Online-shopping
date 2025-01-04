import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Products from './components/products/Products.jsx'
import CategoryProducts from './components/products/CategoryProducts.jsx'
import ShowProduct from './components/products/ShowProduct.jsx'
import SearchProduct from './components/products/SearchProduct.jsx'
import About from './components/utils/About.jsx'
import Contact from './components/utils/Contact.jsx'
import {
  Register,
  Login,
  ForgotPassword,
  ResetPassword,
  
} from './components/index.js'
import CartPage from './components/cart/CartPage.jsx'
import CartItemPage from './components/cart/CartItemPage.jsx'


const router = createBrowserRouter([
  {
    path:"/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Products />,
       
      },
      { 
        path: "/category/:categoryId",
        element: <CategoryProducts />
      },
      {
        path: "/products/:productId",
        element: <ShowProduct >
          
        </ShowProduct>
      },
      {
        path: "/search",
        element: <SearchProduct />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />
      },
      {
        path: "/resetpassword",
        element: <ResetPassword />
      },
      {
        path:"/cart",
        element: <CartPage />
      },
      {
        path:"/cartitems",
        element: <CartItemPage />
      }
    ]
      }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
 