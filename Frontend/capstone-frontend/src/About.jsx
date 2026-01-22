import { Title, Text, List, Stack, Paper } from "@mantine/core";

function About() {
  return (
    <>
      {/* Title outside the container for stronger visual hierarchy */}
      {/* <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Title
          order={1}
          style={{
            color: "#354760",
            fontSize: "2.5rem",
            marginBottom: "1rem",
          }}
        >
          About Us
        </Title>
      </div> */}

      {/* Main content container */}
      <div
        style={{
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "80px",
          padding: "2rem",
          backgroundColor: "#f9f9fc",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
        }}
      >
        <Stack spacing="xl">
          <Text size="lg" style={{ color: "#354760", lineHeight: 1.7 }}>
            Welcome to <strong>ReelTalk</strong> — where cinema meets community.
          </Text>

          <Text size="lg" style={{ color: "#354760", lineHeight: 1.7 }}>
            ReelTalk was born out of a passion for storytelling and the belief that movies are more than just
            entertainment — they’re experiences meant to be shared. Whether you're a casual viewer, a die-hard
            cinephile, or an aspiring critic, ReelTalk gives you a space to voice your thoughts, discover hidden gems,
            and connect with others who love film just as much as you do.
          </Text>

          {/* Bullet section in a styled box with emojis and divider */}
          <Paper
            shadow="xs"
            radius="md"
            p="md"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e0e4ec",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text
              size="lg"
              style={{
                color: "#354760",
                fontWeight: 600,
                marginBottom: "0.5rem",
                textAlign: "center",
              }}
            >
              Our platform empowers users to:
            </Text>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid #ccc",
                marginBottom: "1rem",
              }}
            />

            <List spacing="md" size="lg">
              <List.Item style={{ color: "#354760" }}>🎥 Submit and review films across all genres</List.Item>

              <List.Item style={{ color: "#354760" }}>
                🌟 Share honest opinions and spark meaningful discussions
              </List.Item>

              <List.Item style={{ color: "#354760" }}>🎬 Explore curated recommendations and trending titles</List.Item>

              <List.Item style={{ color: "#354760" }}>
                🗣️ Celebrate the art of cinema with a vibrant, inclusive community
              </List.Item>
            </List>
          </Paper>

          <Text size="lg" style={{ color: "#354760", lineHeight: 1.7 }}>
            ReelTalk is built by movie lovers, for movie lovers — and we’re just getting started. Join us as we turn
            every review into a conversation and every film into a shared experience.
          </Text>
        </Stack>
      </div>
    </>
  );
}

export default About;
