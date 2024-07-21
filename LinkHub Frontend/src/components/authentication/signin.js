import React, { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import serverConfig from "../../utils/serverConfig";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const url = serverConfig + "user/login";
      const response = await axios.post(url, { email, password }, config);
      if (response.status === 202) {
        onOpen();
        setLoading(false);
      } else if (response.status === 203) {
        toast({
          title: "Invalid Email or Password",
          description: "Either email or password is invalid.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      } else if (response.status === 204) {
        toast({
          title: "Email Not Registered",
          description: "User with this email is not registered to LinkHub.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      } else if (response.status === 200) {
        const data = await response.data;
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("LinkhubUserInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/dashboard");
        // window.location.reload();
      }
    } catch (error) {
      // console.log(error);
      toast({
        title: "Error Occurred",
        description: "Error occurred in login process.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const closeBtnHandler = () => {
    onClose();
    window.location.reload();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeBtnHandler} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent
          textAlign="center"
          maxW={{ base: "95%", md: "lg", lg: "2xl" }}
        >
          <ModalHeader fontSize="1.4rem">Verification Email Sent</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="1rem">
            As your email <strong>{email}</strong> is still not verified, a
            verification email has been sent to your email address{" "}
            <strong>{email}</strong>. Check your inbox and verify your email to
            get started. This step is mandatory to get started with LinkHub.
            After verifying log in to your LinkHub account.
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              fontSize="1rem"
              padding=".5rem 1rem"
              mr={3}
              onClick={closeBtnHandler}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack spacing="5px">
        <FormControl id="email_1" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            autoComplete="off"
          />
        </FormControl>
        <FormControl id="password_1" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              autoComplete="off"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl display="flex" justifyContent="flex-start">
          <Link
            href={serverConfig + "user/forgot-password"}
            fontSize="1rem"
            color="blue"
          >
            Forgot your password?
          </Link>
        </FormControl>
        <Button
          colorScheme="green"
          width="100%"
          style={{ marginTop: 17, marginBottom: 4 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
      </VStack>
    </>
  );
};

export default Login;
