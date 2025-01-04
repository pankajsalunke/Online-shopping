import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button } from "../../index.js";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm();
  const [resp, setresp] = useState("");
  const [serverError, setServerError] = useState(null);
  const { errors } = formState;

  const onsubmit = async (data) => {
    const response = await axios
      .post("/api/v1/users/forgotpass", data)
      .then((response) => {
        setresp(response.data.message);
        if (response.data.statusCode === 200) {
          setTimeout(() => {
            navigate("/resetpassword");
          }, 4000);
        }
      })
      .catch((err) => {
        setServerError(err.response.data.message);
        // console.log(err.response.data.message);
      });
    // AxiosError(error)
  };
  return (
    <>
      <div className="min-h-screen  flex flex-col justify-center items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Forgot Password
          </h1>
        </div>
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
        {resp && <p className="text-green-500 text-sm">{resp}</p>}
        <form onSubmit={handleSubmit(onsubmit)}>
          <Input
            label="Email:"
            placeholder="Enter your email"
            type="email"
            className="w-full "
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
          <div className="mt-3">
            <Button type="submit"> Send OTP</Button>
          </div>
        </form>
      </div>
      ;
    </>
  );
}

export { ForgotPassword };
