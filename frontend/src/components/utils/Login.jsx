import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import axios from "axios";
import { useForm } from "react-hook-form";
import Input from "../utils/Input";

const Login = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverResponse, setServerResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const login = async (data) => {
    try {
      setLoading(true);
      setServerError(""); 
      const response = await axios.post("/api/v1/users/login", data);
      setServerResponse(response.data);
      
      if(response) navigate("/")
      // console.log(response.data); 
    } catch (error) {
      setServerError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg bg-gray-200 rounded-xl p-10 border border-black/10">
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-500">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/register"
            className="font-medium text-primary transition-all duration-200 hover:underline text-blue-700"
          >
            Register Here
          </Link>
        </p>

        {serverError && (
          <p className="text-center text-red-500 my-2">{serverError}</p>
        )}
        {serverResponse && (
          <p className="text-center text-green-500 my-2">
            {serverResponse.message}
          </p>
        )}

        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <p className="text-gray-600">
              Forgot password? Click here to{" "}
              <Link
                className="text-blue-600 hover:underline"
                to="/forgotpassword"
              >
                reset password
              </Link>
            </p>
            <Button type="submit" className="hover:bg-blue-800" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
