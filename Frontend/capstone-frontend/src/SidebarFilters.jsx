import { useState } from "react";
import { Select, TextInput, Button, Stack, Title, Divider, Box, Text } from "@mantine/core";

// This component shows a sidebar with filters for movies
// The parent componenet will receive the selected filters
function SidebarFilters(props) {
  const onFilterChange = props.onFilterChange;

  // State for each filter option
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("");

  function handleGenreChange(value) {
    setGenre(value);
  }

  function handleYearChange(event) {
    setYear(event.target.value);
  }

  function handleRatingChange(value) {
    setRating(value);
  }

  function handleSortChange(value) {
    setSort(value);
  }

  // When user clicks "Apply Filters", send all selected filters back to the parent component
  function handleApplyFilters() {
    const filters = {
      genre: genre,
      year: year,
      rating: rating,
      sort: sort,
    };

    // This sends the filters back to the parent component
    onFilterChange(filters);
  }

  // When user clicks "Clear Filters", reset all filters and notify parent
  function handleClearFilters() {
    setGenre(null);
    setYear("");
    setRating(null);
    setSort(null);

    // Send empty filters back to the parent component
    onFilterChange({});
  }

  // Sidebar layout is built via Mantine componenets
  return (
    <Box
      p="md"
      style={{
        backgroundColor: "#354760",
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        width: "250px",
        // alignSelf: "flex-start",
      }}
    >
      {/* Sidebar Title & Subtitle */}
      <Title order={4} style={{ color: "white", fontSize: "18px" }}>
        Explore Popular Movies:
      </Title>

      {/* Subtitle is styled smaller & not bold */}
      <Text
        size="xs"
        mt={2}
        style={{
          color: "#FFC72C",
          fontWeight: 400,
          textAlign: "center",
        }}
      >
        Adjust filters to personalize your feed.
      </Text>

      <Divider my="sm" color="#FFC72C" />

      {/* Filter Inputs */}
      <Stack spacing="sm">
        {/* Genre Filter */}
        <Select
          label="Genre"
          placeholder="Select genre"
          data={["Action", "Comedy", "Drama", "Horror", "Romance"]}
          value={genre}
          onChange={handleGenreChange}
          styles={{
            label: { color: "white" },
            input: { backgroundColor: "white" },
          }}
        />

        {/* Release Year Filter */}
        <TextInput
          label="Release Year"
          placeholder="e.g. 2024"
          value={year}
          onChange={handleYearChange}
          styles={{
            label: { color: "white" },
            input: { backgroundColor: "white" },
          }}
        />

        {/* Rating Filter */}
        <Select
          label="Minimum Rating"
          placeholder="Choose rating"
          data={[
            { value: "1", label: "1+ stars" },
            { value: "2", label: "2+ stars" },
            { value: "3", label: "3+ stars" },
            { value: "4", label: "4+ stars" },
            { value: "5", label: "5 stars only" },
          ]}
          value={rating}
          onChange={handleRatingChange}
          styles={{
            label: { color: "white" },
            input: { backgroundColor: "white" },
          }}
        />

        {/* Sort Order Filter */}
        <Select
          label="Sort By"
          placeholder="Choose sort order"
          data={[
            { value: "newest", label: "Newest" },
            { value: "highest", label: "Highest Rated" },
            { value: "alphabetical", label: "A–Z" },
          ]}
          value={sort}
          onChange={handleSortChange}
          styles={{
            label: { color: "white" },
            input: { backgroundColor: "white" },
          }}
        />

        {/* Apply Filters Button */}
        <Button variant="gradient" gradient={{ from: "#354760", to: "#FFC72C", deg: 90 }} onClick={handleApplyFilters}>
          Apply Filters
        </Button>

        {/* Clear Filters Button */}
        <Button variant="gradient" gradient={{ from: "#354760", to: "#FFC72C" }} onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Stack>
    </Box>
  );
}

export default SidebarFilters;
