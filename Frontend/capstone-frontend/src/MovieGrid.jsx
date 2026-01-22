import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Text,
  Button,
  SimpleGrid,
  Loader,
  Group,
  Box,
  Stack,
  Modal, // modal for trailer popup
} from "@mantine/core";
import { Link } from "react-router-dom";

function MovieGrid({ query, filters }) {
  // State for movies & loading indicator
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for opening/closing the trailer modal
  const [openedTrailerId, setOpenedTrailerId] = useState(null);

  // State for storing YouTube trailer key
  const [trailerKey, setTrailerKey] = useState(null);

  const API_KEY = "cc3900e52f180a5eabb5a0f32bbc48e4";

  // Fetch movies whenever the search query changes
  useEffect(() => {
    setLoading(true);

    let url = "";

    if (query !== "") {
      url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY + "&language=en-US&query=" + query;
    } else {
      url = "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY + "&language=en-US&page=1";
    }

    fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        if (data && data.results) {
          const moviesWithCast = [];

          // Loop through movies & fetch top cast
          for (let i = 0; i < data.results.length; i++) {
            const movie = data.results[i];

            let topCast = [];

            try {
              const castRes = await fetch(
                "https://api.themoviedb.org/3/movie/" + movie.id + "/credits?api_key=" + API_KEY
              );
              const castData = await castRes.json();

              if (castData.cast && Array.isArray(castData.cast)) {
                topCast = castData.cast.slice(0, 3).map((actor) => actor.name);
              }
            } catch (err) {
              topCast = [];
            }

            moviesWithCast.push({ ...movie, topCast: topCast });
          }

          setMovies(moviesWithCast);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching movies:", error);
        setLoading(false);
      });
  }, [query]);

  // Filter movies
  const filteredMovies = [];
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    let include = true;

    // Filter by year
    if (filters.year) {
      const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "";
      if (releaseYear !== filters.year) {
        include = false;
      }
    }

    // Filter by rating
    if (filters.rating) {
      const minRating = parseInt(filters.rating);
      if (movie.vote_average < minRating) {
        include = false;
      }
    }

    if (include) {
      filteredMovies.push(movie);
    }
  }

  // Sort movies
  let sortedMovies = [...filteredMovies];

  if (filters.sort === "newest") {
    sortedMovies.sort((a, b) => {
      const dateA = a.release_date || "";
      const dateB = b.release_date || "";
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    });
  }

  if (filters.sort === "highest") {
    sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
  }

  if (filters.sort === "alphabetical") {
    sortedMovies.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
  }

  // Always show 5 stars, coloring them based on the rating
  function renderGridStars(rating) {
    const stars = [];
    const roundedRating = Math.round(rating / 2); // TMDb rates out of 10/should rate out of 5

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(
          <span key={i} style={{ color: "#FFC72C" }}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} style={{ color: "#ccc" }}>
            ★
          </span>
        );
      }
    }

    return stars;
  }

  // Show loader while fetching
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Trailer modal */}
      <Modal
        opened={openedTrailerId !== null}
        onClose={() => {
          setOpenedTrailerId(null);
          setTrailerKey(null);
        }}
        title="Movie Trailer"
        size="lg"
        centered
      >
        {trailerKey ? (
          <iframe
            width="100%"
            height="400"
            src={"https://www.youtube.com/embed/" + trailerKey + "?autoplay=1&rel=0&modestbranding=1"}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Text>No trailer available.</Text>
        )}

        <Button
          fullWidth
          mt="md"
          variant="gradient"
          gradient={{ from: "#7A7A7A", to: "#354760", deg: 90 }}
          onClick={() => {
            setOpenedTrailerId(null);
            setTrailerKey(null);
          }}
        >
          Close Trailer
        </Button>
      </Modal>

      {/* Movie cards */}
      <SimpleGrid cols={3} spacing="lg">
        {sortedMovies.map((movie) => {
          // Compute year separately
          let year = "N/A";
          if (movie.release_date) {
            year = movie.release_date.slice(0, 4);
          }

          return (
            <Card
              key={movie.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                minHeight: "460px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {/* Movie poster */}
              <Card.Section>
                <Image
                  src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                  alt={movie.title}
                  height={300}
                  fit="cover"
                />
              </Card.Section>

              {/* Title & year */}
              <Text weight={500} size="lg" mt="md" style={{ color: "white" }}>
                {movie.title + " (" + year + ")"}
              </Text>

              {/* Stars */}
              <Group gap="xs" mt={4}>
                <Text>{renderGridStars(movie.vote_average)}</Text>
                <Text c="dimmed" size="sm">
                  {"(" + (movie.vote_average / 2).toFixed(1) + " avg)"}
                </Text>
              </Group>

              {/* Cast */}
              {movie.topCast && movie.topCast.length > 0 && (
                <Box mt="sm">
                  <Text fw={500} style={{ color: "white" }}>
                    Starring:
                  </Text>
                  <Stack gap={2}>
                    {movie.topCast.map((actor, index) => (
                      <Text
                        key={index}
                        size="sm"
                        italic
                        style={{ color: "#FFC72C", textShadow: "0.5px 0.5px 0.5px #ccc" }}
                      >
                        {actor}
                      </Text>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Buttons */}
              <Stack mt="md">
                <Button
                  fullWidth
                  variant="gradient"
                  gradient={{ from: "#354760", to: "#7A7A7A", deg: 90 }}
                  onClick={async () => {
                    // Trailer fetch
                    let trailerKeyLocal = null;
                    try {
                      const res = await fetch(
                        "https://api.themoviedb.org/3/movie/" + movie.id + "/videos?api_key=" + API_KEY
                      );
                      const data = await res.json();

                      for (let i = 0; i < data.results.length; i++) {
                        const vid = data.results[i];
                        if (vid.type === "Trailer" && vid.site === "YouTube") {
                          trailerKeyLocal = vid.key;
                          break;
                        }
                      }
                    } catch {
                      trailerKeyLocal = null;
                    }

                    setTrailerKey(trailerKeyLocal);
                    setOpenedTrailerId(movie.id);
                  }}
                >
                  Play Trailer
                </Button>

                <Button
                  component={Link}
                  to={"/spotlight/" + movie.id}
                  fullWidth
                  variant="gradient"
                  gradient={{ from: "#354760", to: "#7A7A7A", deg: 90 }}
                >
                  View Spotlight
                </Button>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </>
  );
}

export default MovieGrid;
