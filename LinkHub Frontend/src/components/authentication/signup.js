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
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import serverConfig from "../../utils/serverConfig";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [profilePic, setProfilePic] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState();
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "LinkHub Preset");
      data.append("folder", "LinkHub Media");
      data.append("cloud_name", "dor2rxkrs");
      fetch("https://api.cloudinary.com/v1_1/dor2rxkrs/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfilePic(data.url.toString());
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password || !confirmpassword) {
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

    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
        description: "Password and Confirm Password should be same.",
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
      const url = serverConfig + "user/signup";
      const response = await axios.post(
        url,
        { email, password, profilePic },
        config
      );
      if (response.status === 202) {
        toast({
          title: "Email Already Registered",
          description: "This email is already registered to LinkHub.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        onOpen();
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Error occurred in registration process.",
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
            A verification email has been sent to your email address{" "}
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
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            autoComplete="off"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Password"
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
        <FormControl id="confirmpassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => {
                setConfirmpassword(e.target.value);
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
        <FormControl id="pic">
          <FormLabel>Upload Your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>
        <Button
          colorScheme="orange"
          width="100%"
          style={{ marginTop: 17, marginBottom: 4 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
};

export default SignUp;
