import React, { useEffect, useState } from "react";
import { Paper, Title, Text, Button, Stack, Textarea, Group, Skeleton, Image, Box } from "@mantine/core";
import { updateReview, deleteReview } from "./review-api";

function MyReel() {
  // State to store the user's reviews
  const [reviews, setReviews] = useState([]);

  // Loading state for skeleton placeholders
  const [loading, setLoading] = useState(true);

  // Fade-in animation state
  const [fadeIn, setFadeIn] = useState(false);

  // Pagination state (show 5 reviews at a time)
  const [visibleCount, setVisibleCount] = useState(5);

  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);

  // Logged in user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Clear cached reviews when a different user logs in
  localStorage.removeItem("cachedReviews");

  // If no user is logged in, show this message
  if (!user) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Title order={2} mb="lg" style={{ color: "#354760" }}>
          My Reviews
        </Title>
        <Text>You must be logged in to view your reviews.</Text>
      </div>
    );
  }
  // Fetch the user's reviews when the component loads
  useEffect(() => {
    if (!user) return;

    const url = `https://reeltalk-capstone.onrender.com/users/${user.id}/reviews`;

    // Check if cached reviews exist (used only for faster loading)
    const cached = localStorage.getItem("cachedReviews");
    if (cached) {
      const parsed = JSON.parse(cached);
      setReviews(parsed);
      setLoading(false);
      setFadeIn(true);
    }

    // Fetch reviews from backend
    fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        if (!Array.isArray(data)) {
          console.log("Unexpected review data:", data);
          setReviews([]);
          setLoading(false);
          return;
        }

        // Fetch poster for each review using TMDb
        const API_KEY = "cc3900e52f180a5eabb5a0f32bbc48e4";

        const reviewsWithPosters = await Promise.all(
          data.map(async (review) => {
            try {
              const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${review.movie_id}?api_key=${API_KEY}`);
              const tmdbData = await tmdbRes.json();

              return {
                ...review,
                poster_url: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null,
              };
            } catch {
              return { ...review, poster_url: null };
            }
          }),
        );

        setReviews(reviewsWithPosters);

        // Save to cache
        localStorage.setItem("cachedReviews", JSON.stringify(reviewsWithPosters));

        setLoading(false);
        setTimeout(() => setFadeIn(true), 50);
      })
      .catch((error) => {
        console.log("Error fetching reviews:", error);
        setLoading(false);
      });
  }, []);

  // Begin editing a review
  function startEditing(review) {
    setEditingId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  }

  // Save edited review
  async function handleSaveEdit() {
    const updatedData = {
      comment: editComment,
      rating: editRating,
    };

    try {
      const updatedReview = await updateReview(editingId, updatedData);

      setReviews((prev) => {
        const updatedReviews = prev.map((review) =>
          review.id === editingId
            ? { ...review, comment: updatedReview.comment, rating: updatedReview.rating }
            : review,
        );

        // Update cache to match state
        localStorage.setItem("cachedReviews", JSON.stringify(updatedReviews));

        return updatedReviews;
      });

      setEditingId(null);
      setEditComment("");
      setEditRating(0);

      alert("Review updated!");
    } catch (error) {
      console.log("Error updating review:", error);
      alert("Failed to update review.");
    }
  }

  // Delete a review
  async function handleDelete(reviewId) {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    // Remove review from UI immediately
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== reviewId);

      // Keep cache in sync with state
      localStorage.setItem("cachedReviews", JSON.stringify(updated));

      return updated;
    });

    try {
      // Delete from backend
      await deleteReview(reviewId);
    } catch (error) {
      console.log("Error deleting review:", error);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title order={2} mb="lg" style={{ color: "#354760" }}>
        My Reviews
      </Title>

      <Stack gap="lg">
        {loading && (
          <>
            <Text style={{ color: "#354760", fontSize: "16px" }}>Loading your reviews…</Text>
            {Array.from({ length: 3 }).map((_, i) => (
              <Paper key={i} p="md" shadow="sm" withBorder>
                <Skeleton height={200} />
              </Paper>
            ))}
          </>
        )}

        {/* Empty state message when user has no reviews */}
        {!loading && reviews.length === 0 && (
          <Text style={{ color: "white", fontSize: "16px", textAlign: "center" }}>
            You haven’t written any reviews yet. Start exploring movies and share your thoughts — your first review will
            appear here once it’s submitted.
          </Text>
        )}

        {!loading &&
          reviews.slice(0, visibleCount).map((review) => (
            <Paper
              key={review.id}
              p="md"
              shadow="sm"
              withBorder
              style={{
                opacity: fadeIn ? 1 : 0,
                transition: "opacity 0.8s ease-in",
              }}
            >
              <Group align="flex-start" justify="space-between" wrap="nowrap">
                <Box style={{ flex: 1, paddingRight: "1rem" }}>
                  <Text fw={700} style={{ color: "#354760" }}>
                    {review.movie_title}
                  </Text>

                  <Text mt="xs">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} style={{ color: "#FFC72C" }}>
                        ★
                      </span>
                    ))}
                  </Text>

                  {editingId === review.id ? (
                    <>
                      <Textarea mt="sm" value={editComment} onChange={(e) => setEditComment(e.target.value)} />

                      <Group mt="sm">
                        <Button style={{ backgroundColor: "#FFC72C", color: "#354760" }} onClick={handleSaveEdit}>
                          Save
                        </Button>

                        <Button color="gray" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </Group>
                    </>
                  ) : (
                    <>
                      <Text mt="sm">{review.comment}</Text>

                      <Group mt="md">
                        <Button
                          variant="gradient"
                          gradient={{ from: "#7A7A7A", to: "#354760", deg: 90 }}
                          onClick={() => startEditing(review)}
                        >
                          Edit Review
                        </Button>

                        <Button
                          variant="gradient"
                          gradient={{ from: "#FF4D4D", to: "#7A7A7A", deg: 90 }}
                          onClick={() => handleDelete(review.id)}
                        >
                          Delete Review
                        </Button>
                      </Group>
                    </>
                  )}
                </Box>

                <Box style={{ width: 90, height: 135 }}>
                  <Image
                    src={review.poster_url || "https://via.placeholder.com/90x135?text=No+Image"}
                    alt={review.movie_title}
                    fit="cover"
                  />
                </Box>
              </Group>
            </Paper>
          ))}

        {!loading && reviews.length > visibleCount && (
          <Button
            variant="gradient"
            gradient={{ from: "#354760", to: "#7A7A7A", deg: 90 }}
            onClick={() => setVisibleCount((prev) => prev + 5)}
          >
            Load More Reviews
          </Button>
        )}
      </Stack>
    </div>
  );
}

export default MyReel;
