import { createTheme } from "@mantine/core";

// Brand colors for the site
const brandBlue = "#354760"; // main text + brand color
const brandGold = "#FFC72C"; // accent color (stars, gradients)
const brandGray = "#354760"; // soft background gray for cards/sections

// Create & export the theme object
export const theme = createTheme({
  // Set the default primary color for Mantine components
  primaryColor: "brandBlue",

  // Register custom color palettes (Mantine requires 10 shades)
  colors: {
    brandBlue: Array(10).fill(brandBlue),
    brandGold: Array(10).fill(brandGold),
    brandGray: Array(10).fill(brandGray),
  },

  // Global styles for raw HTML elements
  // These styles apply to the <body> element across the entire app
  globalStyles: {
    body: {
      color: brandBlue,
      backgroundColor: "#ffffff",
      fontFamily: "Inter, sans-serif",
    },
  },

  // Heading styles
  headings: {
    fontFamily: "Inter, sans-serif",
    sizes: {
      h1: { color: brandBlue },
      h2: { color: brandBlue },
      h3: { color: brandBlue },
      h4: { color: brandBlue },
    },
  },

  // Default border radius for a softer UI
  defaultRadius: "md",

  // Component-level styling overrides
  components: {
    // Input labels (TextInput, Textarea, Select)
    Input: {
      styles: {
        label: {
          color: brandBlue,
        },
      },
    },

    // Select dropdown labels
    Select: {
      styles: {
        label: {
          color: brandBlue,
        },
      },
    },

    // TextInput labels
    TextInput: {
      styles: {
        label: {
          color: brandBlue,
        },
      },
    },

    // Textarea labels
    Textarea: {
      styles: {
        label: {
          color: brandBlue,
        },
      },
    },

    // Title component default color
    Title: {
      styles: {
        root: {
          color: brandBlue,
        },
      },
    },

    // Text component default color
    Text: {
      styles: {
        root: {
          color: brandBlue,

          // allow inline overrides like color="#FFC72C" in my searchbar
          "&[data-with-color]": {
            color: "inherit",
          },
        },
      },
    },

    // Button styling
    Button: {
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },

    // Card styling
    Card: {
      styles: {
        root: {
          backgroundColor: brandGray, // soft gray card background
        },
      },
    },
  },
});
