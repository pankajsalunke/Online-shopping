import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CartPage from "../cart/CartPage";
import Button from "./Button";

const Header = () => {
  const navigate = useNavigate();
  const [q, setQuery] = useState("");

  const handleOnsubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${q}`);
    }
  };

  return (
    <header className="bg-gray-800 text-white py-6">
      <div className="container pl-4 flex flex-row justify-evenly">
        <div className=" w-3/4 ">
          <form onSubmit={handleOnsubmit} className="flex flex-row">
            <input
              type="text"
              value={q}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="bg-gray-900 text-white 
            border border-gray-600 rounded-lg py-1 px-2 outline-none hover:bg-gray-800"
            />

            <button
              type="submit"
              onClick={() => navigate(`/search`)}
              className="bg-blue-800 w-28 mx-1 h-10 font-semibold rounded-lg hover:bg-blue-900"
            >
              search
            </button>
          </form>
        </div>
        <div className="container mx-auto flex justify-end items-center space-x-8">
          <div className="hover:text-gray-300 cursor-pointer">
            <Link to={"/"}>Home</Link>
          </div>
          <div className="hover:text-gray-300 cursor-pointer"> <Link to={"/about"}>About</Link></div>
          <div className="hover:text-gray-300 cursor-pointer"> <Link to={"/contact"}>Contact</Link></div>
        </div>
        <div className="ml-1">
        <Button className="bg-transparent">
          <Link to={"/cart"}>Cart</Link>
        </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
