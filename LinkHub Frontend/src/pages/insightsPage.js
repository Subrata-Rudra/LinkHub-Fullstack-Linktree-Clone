import { React, useState, useEffect, useCallback } from "react";
import { Box, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import serverConfig from "../utils/serverConfig";
import axios from "axios";

const InsightsPage = () => {
  const [user, setUser] = useState({});
  const [subscriberCount, setSubscriberCount] = useState();
  const [visitCount, setVisitCount] = useState();

  useEffect(() => {
    let linkhubUser = JSON.parse(localStorage.getItem("LinkhubUserInfo"));
    setUser(linkhubUser);
  }, []);

  const getSubscriberCount = useCallback(async () => {
    if (!user || !user.token) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const url = serverConfig + "subscribe/subscriber-count";
      const response = await axios.get(url, config);
      setSubscriberCount(response.data.count);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  const getVisitCount = useCallback(async () => {
    if (!user || !user.token) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const url = serverConfig + "hub/visitCount";
      const response = await axios.get(url, config);
      setVisitCount(response.data.visitCount);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    getSubscriberCount();
    getVisitCount();
  }, [getSubscriberCount, getVisitCount, user]);

  return (
    <>
      <Navbar />
      <Box
        color="black"
        marginTop="8rem"
        fontFamily="monospace"
        backgroundImage="url('./media/analytics.jpg')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        height="67vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Text fontSize="3xl" fontWeight="bold" marginBottom="2rem">
          Insights
        </Text>
        {user.hubExist ? (
          <Box fontSize="2xl">
            <Text>Visits: {visitCount}</Text>
            <Text>Subscribers: {subscriberCount}</Text>
          </Box>
        ) : (
          <>
            <Text fontSize="2xl">No data to show</Text>
          </>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default InsightsPage;
