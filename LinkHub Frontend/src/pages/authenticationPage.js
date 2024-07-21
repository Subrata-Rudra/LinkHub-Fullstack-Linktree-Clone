import { React, useEffect } from "react";
import {
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import SignUp from "../components/authentication/signup";
import SignIn from "../components/authentication/signin";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import { Helmet } from "react-helmet";

const Homepage = () => {
  const navigate = useNavigate();

  // If the user is logged in, then redirect to Dashboard Page
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("LinkhubUserInfo"));
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="title" content="Authentication" />
        <meta
          name="decription"
          content="LinkHub registration or sign up and log in or sign in page."
        />
        <meta
          name="keywords"
          content="linkhub sign up, linkhub sign in, linkhub registration, linkhub login"
        />
      </Helmet>
      <Box bg="yellow">
        <header
          style={{
            backgroundColor: "black",
          }}
        >
          <Text
            style={{
              fontFamily: "monospace",
              fontWeight: "bold",
              padding: ".5rem",
              color: "white",
            }}
            fontSize="4xl"
          >
            <a href="/" title="Linkhub">
              LinkHub
            </a>
          </Text>
        </header>
        <Box
          minHeight="75.5vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg="white"
            maxW={{ base: "95vw", md: "60vw", lg: "45vw" }}
            width="100%"
            m={4}
            p={4}
            borderWidth="1px"
            marginBottom="2rem"
          >
            <Tabs fontFamily="monospace" fontSize="2rem">
              <TabList mb="1em">
                <Tab width="50%">Log In</Tab>
                <Tab width="50%">Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SignIn />
                </TabPanel>
                <TabPanel>
                  <SignUp />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Homepage;
