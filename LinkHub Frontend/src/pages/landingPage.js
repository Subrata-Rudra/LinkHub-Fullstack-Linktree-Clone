import { React, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

const LandingPage = () => {
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
        <meta name="title" content="Home" />
        <meta
          name="decription"
          content="LinkHub is a One Link in Bio solution. Stop stressing about sharing and managing multiple links, just add all your links which you want to share in your LinkHub and share your LinkHub. Whenever you need to share links, just share your linkhub link."
        />
        <meta
          name="keywords"
          content="linkhub, LinkHub, LINKHUB, linktree clone, linktree alternative, one link in bio, one link in bio tool, portfolio, e-visiting-card, linkpocket, linkbucket"
        />
      </Helmet>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        bgColor="yellow"
        minHeight="100vh"
      >
        <header
          style={{
            backgroundColor: "black",
            margin: "1rem",
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
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            fontFamily: "arial",
          }}
        >
          <div
            style={{
              marginLeft: "5rem",
              marginRight: "5rem",
              marginTop: "1rem",
              marginBottom: "1rem",
              padding: "1rem",
              lineHeight: "3.5rem",
              textAlign: "left",
              alignItems: "center",
              flex: "1",
            }}
          >
            <Text fontSize="5xl" fontWeight="bold" color="green">
              Everything you are.
            </Text>
            <Text fontSize="5xl" fontWeight="bold" color="green">
              In one, simple link in bio.
            </Text>
            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "green",
                marginTop: "1rem",
                lineHeight: "1.7rem",
              }}
            >
              Start using LinkHub for your link in bio. One link to help you
              share everything you create, curate and sell from your Instagram,
              Twitter, YouTube and other social media profiles.
            </div>
            <div style={{ marginTop: "2rem" }}>
              <button
                style={{
                  padding: "0.1rem 1.3rem",
                  border: "2px solid black",
                  borderRadius: "3rem",
                  fontSize: "1.1rem",
                  fontWeight: "bolder",
                }}
                onClick={() => navigate("/auth")}
              >
                Claim your LinkHub
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem",
              padding: "1rem",
              minWidth: "30rem",
              flex: "1",
            }}
          >
            <img
              style={{
                border: "2px solid #bec2c0",
                borderRadius: "2rem",
                boxShadow: "5px 5px #bec2c0",
                width: "18rem",
              }}
              src={process.env.PUBLIC_URL + "./media/linkhub page demo.png"}
              alt="LinkHub Page Demo"
            />
          </div>
        </section>
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            fontFamily: "arial",
          }}
        >
          <div
            style={{
              marginLeft: "5rem",
              marginRight: "5rem",
              marginTop: "1rem",
              marginBottom: "1rem",
              padding: "1rem",
              lineHeight: "3.5rem",
              textAlign: "left",
              alignItems: "center",
              flex: "1",
            }}
          >
            <Text fontSize="5xl" fontWeight="bold" color="green">
              Share your LinkHub from your Instagram, Twitter, FaceBook and
              other bios.
            </Text>
            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "green",
                marginTop: "1rem",
                lineHeight: "1.7rem",
              }}
            >
              Add your unique LinkHub URL to all the platforms and places you
              find your audience.
            </div>
            <div style={{ marginTop: "2rem" }}>
              <button
                style={{
                  padding: "0.1rem 1.3rem",
                  border: "2px solid black",
                  borderRadius: "3rem",
                  fontSize: "1.1rem",
                  fontWeight: "bolder",
                }}
                onClick={() => navigate("/auth")}
              >
                Get started for free
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem",
              padding: "1rem",
              minWidth: "30rem",
              flex: "1",
            }}
          >
            <img
              style={{
                margin: "1rem",
                width: "22rem",
              }}
              src={process.env.PUBLIC_URL + "./media/digital_marketing.webp"}
              alt="Digital Marketing"
            />
          </div>
        </section>
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            fontFamily: "arial",
          }}
        >
          <div
            style={{
              marginLeft: "5rem",
              marginRight: "5rem",
              marginTop: "1rem",
              marginBottom: "1rem",
              padding: "1rem",
              lineHeight: "3.5rem",
              textAlign: "left",
              alignItems: "center",
              flex: "1",
            }}
          >
            <Text fontSize="5xl" fontWeight="bold" color="green">
              Analyze your audience and keep your followers engaged.
            </Text>
            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "green",
                marginTop: "1rem",
                lineHeight: "1.7rem",
              }}
            >
              Track how many visits you get in your LinkHub.
            </div>
            <div style={{ marginTop: "2rem" }}>
              <button
                style={{
                  padding: "0.1rem 1.3rem",
                  border: "2px solid black",
                  borderRadius: "3rem",
                  fontSize: "1.1rem",
                  fontWeight: "bolder",
                }}
                onClick={() => navigate("/auth")}
              >
                Get started for free
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem",
              padding: "1rem",
              minWidth: "30rem",
              flex: "1",
            }}
          >
            <img
              style={{
                margin: "1rem",
                width: "22rem",
              }}
              src={process.env.PUBLIC_URL + "./media/analytics.webp"}
              alt="Digital Marketing"
            />
          </div>
        </section>
        <Footer />
      </Box>
    </>
  );
};

export default LandingPage;
