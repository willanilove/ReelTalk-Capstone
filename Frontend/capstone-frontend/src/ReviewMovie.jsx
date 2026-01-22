import React, { useState } from "react";
import { TextInput, Button, SimpleGrid, Card, Image, Text, Title, Stack, Center, Paper, Group } from "@mantine/core";
import { Link } from "react-router-dom";

function ReviewMovie() {
  // Store the search text the user types
  const [query, setQuery] = useState("");

  // Store the list of movies returned from TMDb
  const [movies, setMovies] = useState([]);

  // TMDb API key
  const API_KEY = "cc3900e52f180a5eabb5a0f32bbc48e4";

  // Search TMDb for movies based on the user's query
  async function handleSearch() {
    if (!query.trim()) {
      return;
    }

    try {
      const url = "https://api.themoviedb.org/3/search/movie" + `?api_key=${API_KEY}&query=${query}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.results) {
        setMovies(data.results);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.log("Error searching movies:", error);
    }
  }

  // Clear search/results
  function handleClear() {
    setQuery("");
    setMovies([]);
  }

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        // minHeight: "100vh",
        padding: "40px 16px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          maxWidth: 1000,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        {/* Page Title */}
        <Title order={2} mb="lg" ta="center" style={{ color: "#354760" }}>
          Start a Review
        </Title>

        {/* Search Input & Button */}
        <Stack align="center" mb="xl">
          <TextInput
            placeholder="Search for a movie to begin reviewing..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            style={{ width: "60%" }}
          />

          {/* Search & Clear buttons */}
          <Group>
            <Button onClick={handleSearch} variant="gradient" gradient={{ from: "#354760", to: "#FFC72C", deg: 90 }}>
              Search
            </Button>

            {movies.length > 0 && (
              <Button onClick={handleClear} variant="gradient" gradient={{ from: "#FFC72C", to: "#354760", deg: 90 }}>
                Clear
              </Button>
            )}
          </Group>
        </Stack>

        {/* Review Tips Box */}
        {movies.length === 0 && (
          <Center mb="xl">
            <Paper
              shadow="xs"
              radius="md"
              p="md"
              withBorder
              style={{
                backgroundColor: "#f0f0f0",
                maxWidth: 600,
                width: "100%",
              }}
            >
              <Title order={4} mb="sm" style={{ color: "#354760", textAlign: "center" }}>
                What makes a good review?
              </Title>

              <ul
                style={{
                  paddingLeft: "20px",
                  marginBottom: 0,
                  color: "#354760",
                }}
              >
                <li>Have a strong opinion and back it up with clear examples.</li>
                <li>Entertain the reader with thoughtful insights and well-explained opinions.</li>
                <li>Avoid spoilers and unnecessary descriptions of scenes, dialogue, or plot twists.</li>
                <li>Keep your review short, clear, and concise.</li>
              </ul>
            </Paper>
          </Center>
        )}

        {/* Movie Results Grid */}
        <SimpleGrid cols={3} spacing="lg">
          {movies.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image";

            return (
              <Card key={movie.id} shadow="sm" padding="md" withBorder>
                <Image src={posterUrl} alt={movie.title} height={300} fit="cover" />

                <Text fw={700} mt="sm">
                  {movie.title}
                </Text>

                <Text size="sm" c="dimmed">
                  {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
                </Text>

                <Button
                  component={Link}
                  to={`/spotlight/${movie.id}`}
                  mt="md"
                  variant="gradient"
                  gradient={{ from: "#354760", to: "#FFC72C", deg: 90 }}
                >
                  Add Your Voice
                </Button>
              </Card>
            );
          })}
        </SimpleGrid>
      </Paper>
    </div>
  );
}

export default ReviewMovie;
