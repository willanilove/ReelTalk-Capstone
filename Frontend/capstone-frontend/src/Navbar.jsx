import React, { useEffect, useState } from "react";
import { Box, Flex, Group, Anchor, Button, Image, Menu, Avatar, Burger, Drawer, Stack, Container } from "@mantine/core";
import reeltalkLogo from "./assets/reeltalk-logo-removebg-preview.png";
import { Link } from "react-router-dom";

// Colors used in the nav bar
const PRIMARY_NAV_BLUE = "#354760";
const ACCENT_STAR_YELLOW = "#FFC72C";

// List of nav links for the main menu
// Needed another navlink so inserted temp: need to update later
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Films", href: "/catalogue" },
  { name: "Start a Review", href: "/review-a-movie" },
  { name: "Submit a Film", href: "/submit-a-film" },
  { name: "My Reel", href: "/my-reel" },
];

function Navbar() {
  // Style obj for each nav link
  const linkStyle = {
    fontSize: "18px",
    fontWeight: 600,
    padding: "8px 16px",
    textDecoration: "none",
    color: PRIMARY_NAV_BLUE,
    transition: "color 0.2s ease",
    textShadow: "0.5px 0.5px 0.5px #a9a9a9",
  };

  // Login user
  const [user, setUser] = useState(null);

  // State for mobile drawer menu
  const [drawerOpened, setDrawerOpened] = useState(false);

  // Load user from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // Listen for login/logout events
  useEffect(() => {
    function loadUser() {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    window.addEventListener("userLoggedIn", loadUser);
    window.addEventListener("userLoggedOut", loadUser);

    return () => {
      window.removeEventListener("userLoggedIn", loadUser);
      window.removeEventListener("userLoggedOut", loadUser);
    };
  }, []);

  function handleLogout() {
    // Remove user from localStorage
    localStorage.removeItem("user");

    // Tell the app someone logged out
    window.dispatchEvent(new Event("userLoggedOut"));

    // Redirect to login page
    window.location.href = "/login";
  }

  return (
    <>
      {/* Main Navbar */}
      <Box
        component="nav"
        bg="white"
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          padding: "16px 0px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Adding container to fix the cutoff issue on the right */}
        <Container size="xl">
          {/* wrap="nowrap" prevents desktop content from stacking before hiding */}
          <Flex justify="space-between" align="center" h={60} wrap="nowrap">
            {/* Left side: Logo & nav links */}
            <Group spacing="lg" align="center" style={{ flexShrink: 0 }}>
              {/* Make the logo clickable so it goes to the homepage */}
              <Link to="/" style={{ textDecoration: "none" }}>
                <Image
                  src={reeltalkLogo}
                  alt="ReelTalk Logo"
                  h="auto"
                  w={250}
                  fit="contain"
                  style={{ cursor: "pointer" }}
                />
              </Link>

              {/* Nav links change depending on login status */}
              {/* Updated to use map() so spacing stays even & clean */}
              {/* Hidden on tablet/mobile (visibleFrom="md") */}
              {/* Added marginRight to shift nav links slightly left for spacing */}
              <Group gap={16} visibleFrom="md" style={{ flexShrink: 0, marginRight: "48px" }}>
                {navLinks.map((link) => {
                  // Only show "My Reel" when logged in
                  if (link.name === "My Reel" && !user) {
                    return null;
                  }

                  return (
                    <Anchor key={link.name} component={Link} to={link.href} style={linkStyle}>
                      {link.name}
                    </Anchor>
                  );
                })}

                {/* Show "About Us" only when logged out */}
                {!user && (
                  <Anchor component={Link} to="/about" style={linkStyle}>
                    About Us
                  </Anchor>
                )}
              </Group>
            </Group>

            {/* Right side: Conditional rendering */}
            {/* Only show on larger screens so buttons don't stack */}
            <Group spacing="md" visibleFrom="md" style={{ flexShrink: 0 }}>
              {user ? (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Group spacing="8px" style={{ cursor: "pointer" }}>
                      <Avatar radius="xl" />
                      <span
                        style={{
                          color: PRIMARY_NAV_BLUE,
                          fontWeight: 700,
                          fontSize: "16px",
                          // textShadow: "1px 1px 0 #FFC72C",
                        }}
                      >
                        Welcome Back, {user.username}!
                      </span>
                    </Group>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item component={Link} to="/my-reel" style={{ color: PRIMARY_NAV_BLUE }}>
                      My Reviews
                    </Menu.Item>
                    <Menu.Item disabled style={{ color: PRIMARY_NAV_BLUE }}>
                      Profile Settings
                    </Menu.Item>
                    <Menu.Item disabled style={{ color: PRIMARY_NAV_BLUE }}>
                      Help
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item onClick={handleLogout} style={{ color: PRIMARY_NAV_BLUE }}>
                      Log Out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    style={{
                      backgroundColor: ACCENT_STAR_YELLOW,
                      color: PRIMARY_NAV_BLUE,
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    component={Link}
                    to="/signup"
                    style={{
                      backgroundColor: PRIMARY_NAV_BLUE,
                      color: "white",
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </Group>

            {/* Hamburger menu for mobile/tablet (hiddenFrom="md" hides on desktop) */}
            <Burger
              opened={drawerOpened}
              onClick={() => setDrawerOpened(!drawerOpened)}
              hiddenFrom="md"
              size="md"
              color={PRIMARY_NAV_BLUE}
            />
          </Flex>
        </Container>
      </Box>

      {/* Drawer for mobile nav */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        padding="md"
        size="xs"
        title="Menu"
        hiddenFrom="md"
      >
        <Stack spacing="md">
          {navLinks.map((link) => {
            if (link.name === "My Reel" && !user) {
              return null;
            }

            return (
              <Anchor
                key={link.name}
                component={Link}
                to={link.href}
                style={linkStyle}
                onClick={() => setDrawerOpened(false)}
              >
                {link.name}
              </Anchor>
            );
          })}

          {!user && (
            <Anchor component={Link} to="/about" style={linkStyle} onClick={() => setDrawerOpened(false)}>
              About Us
            </Anchor>
          )}

          {/* Mobile login buttons */}
          {!user ? (
            <>
              <Button
                component={Link}
                to="/login"
                style={{
                  backgroundColor: ACCENT_STAR_YELLOW,
                  color: PRIMARY_NAV_BLUE,
                }}
                onClick={() => setDrawerOpened(false)}
              >
                Sign In
              </Button>

              <Button
                component={Link}
                to="/signup"
                style={{
                  backgroundColor: PRIMARY_NAV_BLUE,
                  color: "white",
                }}
                onClick={() => setDrawerOpened(false)}
              >
                Get Started
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setDrawerOpened(false);
                handleLogout();
              }}
              style={{
                backgroundColor: PRIMARY_NAV_BLUE,
                color: "white",
              }}
            >
              Log Out
            </Button>
          )}
        </Stack>
      </Drawer>
    </>
  );
}

export default Navbar;
