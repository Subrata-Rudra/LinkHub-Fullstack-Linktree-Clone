import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import serverConfig from "../utils/serverConfig";

const AccountPage = () => {
  const [user, setUser] = useState({});
  const [day, setDay] = useState();
  const [date, setDate] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [password, setPassword] = useState();
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    let linkhubUser = JSON.parse(localStorage.getItem("LinkhubUserInfo"));
    setUser(linkhubUser);
  }, []);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  useEffect(() => {
    const dateObject = new Date(user.createdAt);
    setYear(dateObject.getFullYear());
    setMonth(months[dateObject.getMonth()]);
    setDate(dateObject.getDate());
    setDay(daysOfWeek[dateObject.getDay()]);
    // eslint-disable-next-line
  }, [user]);
  const logoutHandler = () => {
    localStorage.removeItem("LinkhubUserInfo");
    navigate("/");
  };

  const deleteRequestHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        data: {
          password: password,
        },
      };
      const url = serverConfig + "user/delete-user-request";
      const response = await axios.delete(url, config);
      if (response.status === 200) {
        setShowOTPInput(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataToSend = {
        otp: OTP,
      };
      const url = serverConfig + "user/verify-delete-otp";
      const response = await axios.post(url, dataToSend, config);
      if (response.status === 200) {
        logoutHandler();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        color="black"
        marginTop="8rem"
        padding=".5rem"
        fontFamily="monospace"
        fontSize={{ base: "1rem", md: "2rem" }}
        height="62vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Text
          fontSize={{ base: "1.5rem", md: "2.5rem", lg: "3.5rem" }}
          fontWeight="bold"
          color="rgb(8, 63, 204)"
          marginBottom="1rem"
        >
          Account Details
        </Text>
        <Text>Username: {user.username}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Joined On: {day + " " + month + " " + date + ", " + year}</Text>
      </Box>
      <Button fontFamily="monospace" colorScheme="blue" onClick={logoutHandler}>
        Log Out
      </Button>
      <Modal isOpen={isOpen} onClose={onclose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent
          textAlign="center"
          maxW={{ base: "95%", md: "lg", lg: "2xl" }}
        >
          <ModalHeader fontSize="1.4rem">
            Delete Your LinkHub Account
          </ModalHeader>
          {showOTPInput ? (
            <ModalBody fontSize="1rem">
              <VStack spacing="5px">
                <Text>
                  We have sent an OTP to your registered email id for deletion
                  of your LinkHub account.
                </Text>
                <FormControl id="otp" isRequired>
                  <FormLabel>OTP</FormLabel>
                  <Input
                    placeholder="OTP sent to your email"
                    onChange={(e) => {
                      setOTP(e.target.value);
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                <Button
                  colorScheme="red"
                  width="100%"
                  style={{ marginTop: 17, marginBottom: 4 }}
                  onClick={deleteHandler}
                >
                  Submit
                </Button>
              </VStack>
            </ModalBody>
          ) : (
            <ModalBody fontSize="1rem">
              <VStack spacing="5px">
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    placeholder="LinkHub Account Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                <Button
                  colorScheme="red"
                  width="100%"
                  style={{ marginTop: 17, marginBottom: 4 }}
                  onClick={deleteRequestHandler}
                >
                  Submit
                </Button>
              </VStack>
            </ModalBody>
          )}
          <ModalFooter>
            <Button
              colorScheme="green"
              fontSize=".9rem"
              padding=".2rem .6rem"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        margin="1rem"
        border="2px solid gray"
        borderRadius=".5rem"
        padding=".5rem"
      >
        <Text
          padding="1rem"
          fontSize={{ base: "1.5rem", md: "1.8rem", lg: "2.5rem" }}
          fontWeight="bold"
          fontFamily="monospace"
        >
          Danger Zone
        </Text>
        <Button
          marginBottom="1rem"
          fontFamily="monospace"
          colorScheme="red"
          onClick={onOpen}
        >
          Delete Account
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default AccountPage;
