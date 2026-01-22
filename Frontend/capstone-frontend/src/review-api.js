// Axios functions for creating, updating & deleting reviews in the backend
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5001";

// Create a new review: user_id, movie_id, comment, rating
export async function createReview(reviewData) {
  try {
    const response = await axios.post(`${BASE_URL}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.log("Error creating review:", error);

    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { error: "Failed to create review" };
    }
  }
}

// Update an existing review: reviewId & updated fields (comment, rating)
export async function updateReview(reviewId, updatedData) {
  try {
    const response = await axios.put(`${BASE_URL}/reviews/${reviewId}`, updatedData);
    return response.data;
  } catch (error) {
    console.log("Error updating review:", error);

    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { error: "Failed to update review" };
    }
  }
}

// Delete a review by ID
export async function deleteReview(reviewId) {
  try {
    const response = await axios.delete(`${BASE_URL}/reviews/${reviewId}`);
    return response.data; // success
  } catch (error) {
    // If the review is already deleted, treat it as success
    if (error.response && error.response.status === 404) {
      return null;
    }

    console.log("Error deleting review:", error);

    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { error: "Failed to delete review" };
    }
  }
}
