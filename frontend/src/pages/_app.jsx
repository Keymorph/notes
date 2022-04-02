/*
  This component contains the shared components that are used on all pages.
*/
import { useEffect, useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider } from "@mui/material/styles";
import { Collapse, Container, Fade, Grow } from "@mui/material";

import { ThemeDark, ThemeLight } from "../components/Themes/Theme";
import Navbar from "../components/Navbar";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(null);

  // Invoke setDarkMode whenever the page loads
  useEffect(() => {
    // If preference was set in localStorage, dont check the browser preference
    // else check the browser preference so that it is set as the default mode
    if (localStorage.getItem("mode")) {
      setDarkMode(JSON.parse(localStorage.getItem("mode")) === "dark");
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  });

  // Set the theme palette based on the dark mode preference
  const theme = useMemo(() => (darkMode ? ThemeDark : ThemeLight), [darkMode]);

  // Change the mode when this function is called
  // Store the preference in localStorage
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("mode", JSON.stringify(!darkMode ? "dark" : "light"));
    console.log(localStorage.getItem("mode"));
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Jotfox: Note Taking App</title>
      </Head>
      <ThemeProvider theme={theme}>
        {/* While page loads, dont display content */}
        {/* This allows */}
        <Fade in={darkMode !== null}>
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              background: darkMode
                ? "linear-gradient(45deg, #1f3091 30%, #0076D0 90%)"
                : "linear-gradient(45deg, #0076D0 30%, #00A0D0 90%)",
              height: "100vh",
              overflowX: "hidden",
            }}
          >
            <Navbar
              darkMode={darkMode}
              handleDarkModeToggle={handleDarkModeToggle}
            />
            {/* Each page is rendered in Component */}
            <Component {...pageProps} />
          </Container>
        </Fade>
      </ThemeProvider>
    </>
  );
}
