import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Montserrat",
    body: "Roboto",
  },
  colors: {
    green: {
      500: "#2FAA54",
    },
    gray: {
      50: "#fefdfe",
      500: "#D6D9DB",
      800: "#323F4B",
    },
    red: {
      300: "#F17E9D",
    },
    orange: {
      200: "#F1BE9F",
    },
    blue: {
      300: "#6AB1EF",
      500: "#0583F2",
      700: "#394D72",
    },
  },
  styles: {
    global: {
      html: {
        height: "100%",
      },
      body: {
        bg: "#F2F2F2",
        color: "#252525",
      },
    },
  },
});
