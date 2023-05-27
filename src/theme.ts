import { extendTheme, Theme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,

  // fonts: {
  //   heading: `'Open Sans', sans-serif`,
  //   body: `'Raleway', sans-serif`,
  // },
};

const theme = extendTheme({
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
    xl: "1200px",
    "2xl": "1536px",
  },
  ...config,
});

export default theme;
