import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Title, Text, Image, Box, Divider, Textarea, Button, Group, Grid, Avatar } from "@mantine/core";
import { createReview, updateReview, deleteReview } from "./review-api";

function MovieSpotlight() {
  const { id } = useParams(); // Get the movie ID from URL

  // State for the movie details
  const [movie, setMovie] = useState(null);

  // State for the list of reviews
  const [reviews, setReviews] = useState([]);

  // State for the cast list
  const [cast, setCast] = useState([]);

  // Review form state
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);

  // Logged in user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Fetch movie & cast when component loads
  useEffect(() => {
    // Fetch movie & reviews from backend
    fetch("http://127.0.0.1:5001/api/movies/" + id)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setMovie(data.movie);
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.log("Error fetching spotlight:", err));

    // Fetch cast from TMDb
    fetch("https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=cc3900e52f180a5eabb5a0f32bbc48e4")
      .then((res) => res.json())
      .then((data) => {
        if (data.cast && Array.isArray(data.cast)) {
          setCast(data.cast.slice(0, 3).map((actor) => actor.name));
        }
      })
      .catch((err) => console.log("Error fetching cast:", err));
  }, [id]);

  // Calculate average rating
  let displayRating = 0;
  if (reviews.length > 0) {
    let total = 0;
    for (let i = 0; i < reviews.length; i++) total += reviews[i].rating;
    displayRating = total / reviews.length;
  } else if (movie && movie.vote_average) {
    displayRating = movie.vote_average / 2;
  }

  // Render stars
  function renderStars(ratingCount) {
    const stars = [];
    const rounded = Math.round(ratingCount);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rounded ? "#FFC72C" : "#ccc", fontSize: "20px" }}>
          ★
        </span>
      );
    }
    return stars;
  }

  // Submit a new review
  async function handleSubmitReview() {
    if (!user) return alert("You must be logged in to leave a review.");
    if (!comment || !rating) return alert("Enter a comment and rating.");

    const reviewData = {
      user_id: user.id,
      movie_id: Number(id),
      comment,
      rating,
    };

    try {
      const newReview = await createReview(reviewData);

      setReviews((prev) => [...prev, newReview]);

      setComment("");
      setRating(0);

      alert("Review submitted!");
    } catch (err) {
      console.log(err);
      alert("Failed to submit review.");
    }
  }

  // Start editing a review
  function startEditing(review) {
    setEditingId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  }

  // Save edited review
  async function handleSaveEdit() {
    try {
      const updated = await updateReview(editingId, {
        comment: editComment,
        rating: editRating,
      });

      setReviews((prev) => prev.map((r) => (r.id === editingId ? updated : r)));

      setEditingId(null);
      setEditComment("");
      setEditRating(0);

      alert("Review updated!");
    } catch (err) {
      console.log(err);
      alert("Failed to update review.");
    }
  }

  // Delete a review
  async function handleDelete(reviewId) {
    if (!window.confirm("Delete this review?")) return;

    // Remove review from UI immediately
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));

    try {
      // Delete from backend
      await deleteReview(reviewId);
    } catch (err) {
      console.log("Error deleting review:", err);
    }
  }

  if (!movie) return <Text style={{ color: "white" }}>Loading...</Text>;

  return (
    <Container size="lg" py="xl">
      <Grid gutter="xl" align="flex-start">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Image src={movie.poster_url} alt={movie.title} radius="md" />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Title order={2} mb="xs" style={{ color: "white" }}>
            {movie.title} ({movie.year})
          </Title>

          <Group gap="xs" mt={4} mb="md">
            <Text>{renderStars(displayRating)}</Text>
            <Text c="dimmed" size="sm">
              ({displayRating.toFixed(1)} avg)
            </Text>
          </Group>

          <Text mt="sm" style={{ color: "white" }}>
            {movie.description}
          </Text>

          {cast.length > 0 && (
            <Box mt="md">
              <Text fw={600} style={{ color: "white" }}>
                Starring:
              </Text>
              {cast.map((actor, i) => (
                <Text key={i} style={{ color: "#FFC72C" }}>
                  {actor}
                </Text>
              ))}
            </Box>
          )}

          {user ? (
            <Box mt="xl">
              <Title order={3} mb="sm" style={{ color: "white" }}>
                Leave a Review
              </Title>

              <Group mb="sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      color: star <= rating ? "#FFC72C" : "#ccc",
                    }}
                  >
                    ★
                  </span>
                ))}
              </Group>

              <Textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                minRows={3}
              />

              <Button mt="md" style={{ backgroundColor: "#FFC72C", color: "#354760" }} onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </Box>
          ) : (
            <Text mt="sm" style={{ color: "white" }}>
              Log in to leave a review.
            </Text>
          )}
        </Grid.Col>
      </Grid>

      <Divider my="xl" />

      <Title order={3} mb="md" style={{ color: "white" }}>
        User Reviews
      </Title>

      {reviews.length === 0 ? (
        <Text style={{ color: "white" }}>No reviews yet.</Text>
      ) : (
        reviews.map((review) => (
          <Box key={review.id} mb="lg">
            <Group align="center" gap="sm">
              <Avatar radius="xl" color="blue">
                {review.username ? review.username.charAt(0).toUpperCase() : "?"}
              </Avatar>

              <Group align="center" gap="xs">
                <Text fw={600} style={{ color: "white" }}>
                  {review.username}
                </Text>
                <Text>{renderStars(review.rating)}</Text>
              </Group>
            </Group>

            {editingId === review.id ? (
              <Box mt="sm">
                <Group mb="xs">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onClick={() => setEditRating(s)}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: s <= editRating ? "#FFC72C" : "#ccc",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </Group>

                <Textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} minRows={2} />

                <Group mt="sm" gap="sm">
                  <Button style={{ backgroundColor: "#FFC72C", color: "#354760" }} size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>

                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => {
                      setEditingId(null);
                      setEditComment("");
                      setEditRating(0);
                    }}
                  >
                    Cancel
                  </Button>
                </Group>
              </Box>
            ) : (
              <Text mt="sm" style={{ color: "white" }}>
                {review.comment}
              </Text>
            )}

            {user && review.user_id === user.id && editingId !== review.id && (
              <Group mt="xs">
                <Button size="xs" color="#7A7A7A" onClick={() => startEditing(review)}>
                  Edit
                </Button>
                <Button size="xs" color="red" onClick={() => handleDelete(review.id)}>
                  Delete
                </Button>
              </Group>
            )}
          </Box>
        ))
      )}
    </Container>
  );
}

export default MovieSpotlight;
