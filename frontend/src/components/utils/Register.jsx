import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";


const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    address: "",
    Mnumber: "",
    role: "",
    avatar: null, // Use null for file uplods
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState(null);
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value, // Handle file input for avatar
    }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = "Username is required";

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password) tempErrors.password = "Password is required";
    if (!formData.fullname) tempErrors.fullname = "Fullname is required";
    if (!formData.address) tempErrors.address = "Address is required";
    if (!formData.role) tempErrors.role = "Role is required";
    if (!formData.avatar) tempErrors.avatar = "Avatar is required";
    if (!formData.Mnumber) {
      tempErrors.Mnumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.Mnumber)) {
      tempErrors.Mnumber = "Invalid mobile number format";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("fullname", formData.fullname);
      data.append("address", formData.address);
      data.append("role", formData.role);
      data.append("avatar", formData.avatar);
      data.append("Mnumber", formData.Mnumber);

      try {
        const response = await axios.post("/api/v1/users/register", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setServerResponse(response.data);
        if(response.data.success) navigate("/login")
        console.log("server Response: ", response.data.success);
      } catch (error) {
        console.error("Error Submitting the form :", error);
        setServerResponse(error.response.data || "An error Occured");
      }
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto p-4 ">
      <div className="mb-4">
        <label
          className="block text-gray-500 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`bg-gradient-to-r from-gray-800 to-black text-white shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 focus:border-gray-500
            ${errors.username ? 'border-red-500' : ''} ${
            errors.username ? "border-red-500" : ""
          }
         `}
          placeholder="Enter your username"
        />
        {errors.username && (
          <p className="text-red-500 text-xs italic">{errors.username}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`bg-gradient-to-r from-gray-800 to-black text-white shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.username ? 'border-red-500' : ''} ${
            errors.email ? "border-red-500" : ""
          }`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs italic">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="fullname"
        >
          Full Name
        </label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          className={`bg-gradient-to-r from-gray-800 to-black text-white shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.username ? 'border-red-500' : ''} ${
            errors.fullname ? "border-red-500" : ""
          }`}
          placeholder="Enter your full name"
        />
        {errors.fullname && (
          <p className="text-red-500 text-xs italic">{errors.fullname}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`bg-gradient-to-r from-gray-800 to-black text-white shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.username ? 'border-red-500' : ''} ${
            errors.password ? "border-red-500" : ""
          }`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs italic">{errors.password}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="address"
        >
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`bg-gradient-to-r from-gray-800 to-black text-white shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.username ? 'border-red-500' : ''} ${
            errors.address ? "border-red-500" : ""
          }`}
          placeholder="Enter your address"
        />
        {errors.address && (
          <p className="text-red-500 text-xs italic">{errors.address}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="Mnumber"
        >
          Mobile Number
        </label>
        <input
          type="text"
          name="Mnumber"
          value={formData.Mnumber}
          onChange={handleChange}
          className={`bg-gradient-to-r from-gray-800 to-black text-white shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.username ? 'border-red-500' : ''} ${
            errors.Mnumber ? "border-red-500" : ""
          }`}
          placeholder="Enter your mobile number"
        />
        {errors.Mnumber && (
          <p className="text-red-500 text-xs italic">{errors.Mnumber}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="role"
        >
          Role
        </label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`bg-gradient-to-r from-gray-800 to-black text-white shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.username ? 'border-red-500' : ''} ${
            errors.role ? "border-red-500" : ""
          }`}
          placeholder="Enter your role"
        />
        {errors.role && (
          <p className="text-red-500 text-xs italic">{errors.role}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="avatar"
        >
          Avatar
        </label>
        <input
          type="file"
          name="avatar"
          onChange={handleChange}
          className={`bg-gradient-to-r from-gray-800 to-black text-white shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.username ? 'border-red-500' : ''} ${
            errors.avatar ? "border-red-500" : ""
          }`}
        />
        {errors.avatar && (
          <p className="text-red-500 text-xs italic">{errors.avatar}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
      </div>
      <div className="mt-2 flex flex-row gap-2">
        <p className="text-black">do you hav an account? </p>
        
        <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline text-blue-700"
          >
            Login
          </Link>
        
      </div>
     
      {serverResponse && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{serverResponse.message || serverResponse}</p>
        
        </div>
      )}
    </form>
  
  );
};

export default Register;
