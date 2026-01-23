import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, Textarea, Button, Paper, Title, Stack, Alert, NumberInput, Select } from "@mantine/core";

function SubmitFilm() {
  // State for each form field
  const [title, setTitle] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState("");
  const [cast, setCast] = useState("");
  const [runtime, setRuntime] = useState("");
  const [language, setLanguage] = useState("");

  // State for success or error messages
  const [message, setMessage] = useState("");

  // Track whether form was submitted
  const [submitted, setSubmitted] = useState(false);

  // Used to navigate between pages
  const navigate = useNavigate();

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handlePosterUrlChange(event) {
    setPosterUrl(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleReleaseYearChange(value) {
    setReleaseYear(value);
  }

  function handleGenreChange(value) {
    setGenre(value);
  }

  function handleCastChange(event) {
    setCast(event.target.value);
  }

  function handleRuntimeChange(value) {
    setRuntime(value);
  }

  function handleLanguageChange(value) {
    setLanguage(value);
  }

  // Handle the form submission
  async function handleSubmit(event) {
    event.preventDefault();

    // Clear any previous message
    setMessage("");

    try {
      // Build the request body
      const movieData = {
        title: title,
        poster_url: posterUrl,
        description: description,
        release_year: releaseYear,
        genre: genre,
        cast: cast,
        runtime: runtime,
        language: language,
      };

      // Send the POST request to the backend
      const response = await fetch("https://reeltalk-capstone.onrender.com/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      // If the backend returns an error status
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error || "Something went wrong.");
        return;
      }

      // If the movie was added successfully
      const data = await response.json();

      // Updated success message
      setMessage(
        `The movie "${data.title}" has been added successfully. Please allow 1–3 business days for review. We will notify you by email once it's approved.`,
      );

      // Hide the form
      setSubmitted(true);
    } catch (error) {
      console.log("Error submitting movie:", error);
      setMessage("Error submitting movie. Please try again.");
    }
  }

  function goHome() {
    navigate("/");
  }

  function reloadPage() {
    window.location.reload();
  }

  return (
    // Wrapper to center the form on the page
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "40px 16px",
      }}
    >
      {/* Updated layout: wider form & centered inside wrapper */}
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          maxWidth: 800,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        {/* Title changes after submission */}
        <Title order={2} mb="lg" style={{ textAlign: "center" }}>
          {submitted ? "Thank you for your submission!" : "Submit a Film"}
        </Title>

        {/* Show success or error message */}
        {message && (
          <Alert color={submitted ? "green" : "blue"} mb="lg">
            {message}
          </Alert>
        )}

        {/* Show form only if not submitted */}
        {!submitted && (
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Title"
                placeholder="Enter movie title"
                value={title}
                onChange={handleTitleChange}
                required
              />

              <TextInput
                label="Poster URL"
                placeholder="https://example.com/poster.jpg"
                value={posterUrl}
                onChange={handlePosterUrlChange}
                required
              />

              <Textarea
                label="Description"
                placeholder="Write a short summary of the movie"
                value={description}
                onChange={handleDescriptionChange}
                minRows={4}
                required
              />

              <NumberInput
                label="Release Year"
                placeholder="e.g. 2025"
                value={releaseYear}
                onChange={handleReleaseYearChange}
                min={1900}
                max={2100}
                required
                styles={{
                  label: {
                    color: "#354760",
                  },
                }}
              />

              <Select
                label="Genre"
                placeholder="Select genre"
                data={["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller", "Documentary"]}
                value={genre}
                onChange={handleGenreChange}
                required
              />

              <Textarea
                label="Cast / Starring Actors"
                placeholder="List main actors separated by commas"
                value={cast}
                onChange={handleCastChange}
                minRows={2}
                required
              />

              <NumberInput
                label="Runtime (in minutes)"
                placeholder="e.g. 120"
                value={runtime}
                onChange={handleRuntimeChange}
                min={1}
                required
                styles={{
                  label: {
                    color: "#354760",
                  },
                }}
              />

              <Select
                label="Language"
                placeholder="Select language"
                data={["English", "Spanish", "French", "German", "Japanese", "Korean", "Other"]}
                value={language}
                onChange={handleLanguageChange}
                required
              />

              <Button type="submit" variant="gradient" gradient={{ from: "#354760", to: "#FFC72C", deg: 90 }}>
                Add Movie
              </Button>
            </Stack>
          </form>
        )}

        {/* Show action buttons after submission */}
        {submitted && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {/* Go back to home page */}
            <Button variant="gradient" gradient={{ from: "#354760", to: "#FFC72C", deg: 90 }} onClick={goHome}>
              ← Go Back Home
            </Button>

            {/* Reload page to submit another movie */}
            <Button variant="gradient" gradient={{ from: "#354760", to: "#FFC72C", deg: 90 }} onClick={reloadPage}>
              Submit Another Movie
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default SubmitFilm;
