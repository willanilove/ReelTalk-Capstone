import { useState } from "react";
import { Container, Title, Box, Image, Text, Button, SimpleGrid } from "@mantine/core";
import theRipPoster from "./assets/therip_2026.jpeg";

const PRIMARY_NAV_BLUE = "#354760";
const ACCENT_STAR_YELLOW = "#FFC72C";

// Featured Film of the Week
const featuredMovie = {
  title: "The Rip",
  year: 2026,
  rating: 4.0,
  poster: theRipPoster,
  starring: ["Matt Damon", "Ben Affleck"],
};

// Sample movie list
const allMovies = [
  {
    id: 1,
    title: "The Rip",
    year: 2026,
    rating: 4.0,
    poster: theRipPoster,
    genre: "Action",
  },
  {
    id: 2,
    title: "Laugh Out Loud",
    year: 2023,
    rating: 3.5,
    poster: "https://via.placeholder.com/200x300?text=Comedy+Movie",
    genre: "Comedy",
  },
  {
    id: 3,
    title: "Deep Feelings",
    year: 2024,
    rating: 4.2,
    poster: "https://via.placeholder.com/200x300?text=Drama+Movie",
    genre: "Drama",
  },
  {
    id: 4,
    title: "Night Watch",
    year: 2025,
    rating: 3.8,
    poster: "https://via.placeholder.com/200x300?text=Thriller+Movie",
    genre: "Thriller",
  },
];

function Catalog() {
  const [selectedGenre, setSelectedGenre] = useState("");

  let filteredMovies = [];

  if (selectedGenre !== "") {
    filteredMovies = allMovies.filter((movie) => {
      return movie.genre === selectedGenre;
    });
  }

  return (
    <Box
      style={{
        backgroundColor: PRIMARY_NAV_BLUE,
        minHeight: "100vh",
        width: "100%",
        paddingBottom: "40px",
      }}
    >
      <Container size="md" py="xl">
        {/* Page title */}
        <Title
          order={1}
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          Featured Film of the Week
        </Title>

        {/* Featured movie */}
        <Box style={{ textAlign: "center", marginBottom: "40px" }}>
          <Image
            src={featuredMovie.poster}
            alt={featuredMovie.title}
            width={300}
            height={450}
            fit="cover"
            radius="md"
            mx="auto"
          />

          <Text mt="sm" fw={700} size="lg" style={{ color: "white" }}>
            {featuredMovie.title} ({featuredMovie.year})
          </Text>

          <Text style={{ color: ACCENT_STAR_YELLOW }}>★★★★☆ ({featuredMovie.rating} avg)</Text>

          <Text style={{ color: ACCENT_STAR_YELLOW }}>Starring: {featuredMovie.starring.join(", ")}</Text>
        </Box>

        {/* Genre buttons in 2 column layout */}
        <Title
          order={2}
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          Browse by Genre
        </Title>

        <Box style={{ maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
          <SimpleGrid cols={2} spacing="md">
            <Button
              fullWidth
              onClick={() => {
                setSelectedGenre("Action");
              }}
              style={{
                backgroundColor: ACCENT_STAR_YELLOW,
                color: PRIMARY_NAV_BLUE,
              }}
            >
              Action
            </Button>

            <Button
              fullWidth
              onClick={() => {
                setSelectedGenre("Drama");
              }}
              style={{
                backgroundColor: ACCENT_STAR_YELLOW,
                color: PRIMARY_NAV_BLUE,
              }}
            >
              Drama
            </Button>

            <Button
              fullWidth
              onClick={() => {
                setSelectedGenre("Comedy");
              }}
              style={{
                backgroundColor: ACCENT_STAR_YELLOW,
                color: PRIMARY_NAV_BLUE,
              }}
            >
              Comedy
            </Button>

            <Button
              fullWidth
              onClick={() => {
                setSelectedGenre("Thriller");
              }}
              style={{
                backgroundColor: ACCENT_STAR_YELLOW,
                color: PRIMARY_NAV_BLUE,
              }}
            >
              Thriller
            </Button>
          </SimpleGrid>

          {/* Clear Option */}
          {selectedGenre !== "" && (
            <Text
              onClick={() => {
                setSelectedGenre("");
              }}
              style={{
                color: ACCENT_STAR_YELLOW,
                textAlign: "center",
                marginTop: "12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Clear
            </Text>
          )}
        </Box>

        {/* Movie feed */}
        {selectedGenre !== "" && (
          <>
            <Title
              order={3}
              style={{
                color: "white",
                marginBottom: "16px",
                marginTop: "30px",
              }}
            >
              {selectedGenre} Movies
            </Title>

            {filteredMovies.map((movie) => {
              return (
                <Box
                  key={movie.id}
                  style={{
                    marginBottom: "20px",
                    backgroundColor: "white",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  {/* <Image src={movie.poster} alt={movie.title} width={150} radius="md" /> */}
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    radius="md"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />

                  <Text fw={600} mt="sm">
                    {movie.title}
                  </Text>

                  <Text>Rating: {movie.rating} ★</Text>
                </Box>
              );
            })}
          </>
        )}
      </Container>
    </Box>
  );
}

export default Catalog;
