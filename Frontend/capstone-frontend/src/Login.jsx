import { useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { Button, Center, PasswordInput, TextInput, Tooltip, Title, Stack, Paper, Text } from "@mantine/core";
import { Anchor } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./auth-api";

function Login({ mode = "login" }) {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Extra fields used only during signup
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Controls whether the password tooltip is visible
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Validation rule: password must be at least 6 characters
  let passwordIsValid = false;
  if (password.trim().length >= 6) {
    passwordIsValid = true;
  }

  // After login/signup direct the user to the homepage
  const navigate = useNavigate();

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    if (mode === "signup") {
      // Build the user data object
      const userData = {
        username: fullName,
        email: email,
        password: password,
      };

      try {
        const data = await registerUser(userData);

        const welcomeMessage = "Welcome, " + data.username + "! Your account was created.";
        alert(welcomeMessage);

        navigate("/login");

        // Clear the form fields
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        console.log("Signup error:", error);

        let message = "Signup failed.";
        if (error && error.error) {
          message = error.error;
        }

        alert(message);
      }
    } else {
      // Login Logic
      const loginData = {
        email: email,
        password: password,
      };

      try {
        const data = await loginUser(loginData);

        let message = "Login successful!";
        if (data && data.message) {
          message = data.message;
        }

        alert(message);

        // Store user in local storage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Trigger global event for other components
        window.dispatchEvent(new Event("userLoggedIn"));

        navigate("/");
      } catch (error) {
        console.log("Login error:", error);

        let message = "Login failed.";
        if (error && error.error) {
          message = error.error;
        }

        alert(message);
      }
    }
  }

  // Determine which title to show
  let formTitle = "";
  let formSubtext = "";

  if (mode === "signup") {
    formTitle = "Create an account";
  } else {
    formTitle = "Welcome Back";
    formSubtext = "Sign in to your account";
  }

  return (
    <Center mih="70vh">
      <Paper shadow="sm" radius="md" p="xl" withBorder style={{ width: 480 }}>
        {/* Form Title */}
        {mode === "signup" ? (
          <Title order={3} mb="md" style={{ color: "#354760" }}>
            {formTitle}
          </Title>
        ) : (
          <Stack spacing="xs" mb="md" align="center">
            <Title order={2} style={{ color: "#354760" }}>
              {formTitle}
            </Title>
            <Text size="sm" color="dimmed">
              {formSubtext}
            </Text>
          </Stack>
        )}

        <form onSubmit={handleSubmit}>
          <Stack>
            {/* Full name field (signup only) */}
            {mode === "signup" && (
              <TextInput
                label="Full Name"
                placeholder="Your full name"
                required
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                }}
                styles={{ label: { color: "#354760" } }}
              />
            )}

            {/* Email input */}
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              styles={{ label: { color: "#354760" } }}
              rightSection={
                <Tooltip label="We store your data securely" withArrow>
                  <IconInfoCircle size={18} stroke={1.5} color="gray" />
                </Tooltip>
              }
            />

            {/* Password input with tooltip validation */}
            <Tooltip
              label={passwordIsValid ? "All good!" : "Password must include at least 6 characters"}
              opened={tooltipOpen}
              color={passwordIsValid ? "teal" : "red"}
              withArrow
            >
              <PasswordInput
                label="Password"
                required
                placeholder="Your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                onFocus={() => {
                  setTooltipOpen(true);
                }}
                onBlur={() => {
                  setTooltipOpen(false);
                }}
                styles={{ label: { color: "#354760" } }}
              />
            </Tooltip>

            {/* Confirm password field (signup only) */}
            {mode === "signup" && (
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
                styles={{ label: { color: "#354760" } }}
              />
            )}

            {/* Submit button */}
            <Button
              type="submit"
              mt="md"
              fullWidth
              style={{
                backgroundColor: "#FFC72C",
                color: "#354760",
              }}
            >
              {mode === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </Stack>
        </form>

        {/* Footer link */}
        {mode === "signup" ? (
          <Text size="sm" mt="md" align="center">
            Already have an account?{" "}
            <Anchor component={Link} to="/login" style={{ color: "#354760", fontWeight: 500 }}>
              Sign In
            </Anchor>
          </Text>
        ) : (
          <Text size="sm" mt="md" align="center">
            Don’t have an account?{" "}
            <Anchor component={Link} to="/signup" style={{ color: "#354760", fontWeight: 500 }}>
              Sign Up
            </Anchor>
          </Text>
        )}
      </Paper>
    </Center>
  );
}

export default Login;
