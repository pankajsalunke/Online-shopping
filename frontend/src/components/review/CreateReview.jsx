import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Button from "../utils/Button";

const CreateReview = ({ productId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverResponse, setServerResponse] = useState(null);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/v1/review/product/${productId}/review`,
        {
          comment: data.comment,
          rating: data.rating,
        }
      );
      setServerResponse(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
      // console.error("Error creating review:", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Write a Review</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Comment:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Write your review here"
            {...register("comment", { required: "Comment is required" })}
          />
          {errors.comment && (
            <p className="text-red-500 text-sm">{errors.comment.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Rating (1-5):</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("rating", { required: "Rating is required" })}
          >
            <option value="">Select a rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          {errors.rating && (
            <p className="text-red-500 text-sm">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>

      {serverResponse && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 border border-green-400 rounded">
          {serverResponse.message || "Review submitted successfully!"}
        </div>
      )}
      {serverError && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
          {serverError.message || "Something went wrong!"}
        </div>
      )}
    </div>
  );
};

export default CreateReview;
