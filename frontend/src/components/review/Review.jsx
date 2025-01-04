import React, { useEffect, useState } from "react";
import axios from "axios";
import loader from "../../assets/Search.gif";
import CreateReview from "./CreateReview";
import "./style.css";
import { useNavigate } from "react-router-dom";

function Review({ id }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState("");

  useEffect(() => {
    axios
      .get(`/api/v1/review/product/${id}/reviews`)
      .then((response) => {
        const data = response.data.data;
        // console.log(data);

        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  }, [id]);

  const handleUpdateReview = (reviewId, comment) => {
    setEditingReviewId(reviewId);
    setEditedReview(comment);
  };

  const handleSaveUpdateReview = (reviewId) => {
    // console.log(reviewId);
    axios
      .patch(`/api/v1/review/review/${reviewId}`, { comment: editedReview })
      .then((response) => {
        // Update the state with the new review data
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === reviewId
              ? { ...review, comment: editedReview }
              : review
          )
        );
        setEditingReviewId(null);
      })
      .catch((error) => {
        console.error("Error updating review:", error);
      })

    // useEffect(() => {
      
    // },[reviewId])
  }

  const handleDeleteReview = (reviewId) => {
    axios
      .delete(`/api/v1/review/review/${reviewId}`)
      .then((response) => {
        // console.log(`Review with ID: ${reviewId} deleted successfully`);

        // Update the state to remove the deleted review
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== reviewId)
        );
      })
      .catch((error) => {
        console.error(`Error deleting review with ID: ${reviewId}`, error);
      });
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-center mt-20 text-xl text-gray-500">
        <img src={loader} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg max-h-96 overflow-y-auto custom-scrollbar">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Reviews</h1>
      <div className="mb-5">
        <CreateReview productId={id} />
      </div>
      <div className="space-y-6 ">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={review.user.avatar}
                  alt="userImg"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h2 className="font-semibold text-gray-800">
                    {review.user.username}
                  </h2>

                  {editingReviewId === review._id ? (
                    <textarea
                      className="border border-gray-300 rounded-md p-2 mt-2 w-full"
                      value={editedReview}
                      onChange={(e) => setEditedReview(e.target.value)}
                    />
                  ) : (
                    <div className="text-gray-600">
                      {review.comment.length > 80 ? (
                        <p className="h-20 overflow-y-scroll custom-scrollbar">
                          {review.comment}
                        </p>
                      ) : (
                        review.comment
                      )}
                    </div>
                  )}

                  <div className="text-yellow-500 flex">
                    <span>Ratings: </span>
                    <span className="ml-1">{review.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {editingReviewId === review._id ? (
                  // Show save button if editing
                  <button
                    className="px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                    onClick={() => handleSaveUpdateReview(review._id)}
                  >
                    Save
                  </button>
                ) : (
                  // Show update button if not editing
                  <button
                    className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                    onClick={() =>
                      handleUpdateReview(review._id, review.comment)
                    }
                  >
                    Update
                  </button>
                )}

                <button
                  className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">
            <p>No reviews found for this product.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;
