import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Spacer,
  Link,
  Text,
  Avatar,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import serverConfig from "../utils/serverConfig";

const Navbar = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    let linkhubUser = JSON.parse(localStorage.getItem("LinkhubUserInfo"));
    setUser(linkhubUser);
  }, []);

  const previewUrl = serverConfig + "PREVIEW_LINKHUB@" + user.username;

  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
  };
  const linkStyle = {
    textDecoration: "none",
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      fontFamily="monospace"
      align="center"
      bg="black"
      p={4}
      color="white"
      style={navbarStyle}
    >
      <IconButton
        icon={<HamburgerIcon boxSize={6} />}
        aria-label="Open Menu"
        display={{ base: "block", md: "none" }}
        onClick={onOpen}
        bg="black"
        color="white"
      />
      <Text ml={3} mr={5} fontSize="1.55rem">
        LinkHub
      </Text>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader bg="#2e2e2d" color="white" borderBottomWidth="1px">
              {" "}
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                aria-label="Close"
                onClick={onClose}
                position="absolute"
                top={2}
                right={2}
                bg="black"
                color="white"
              />{" "}
              Menu
            </DrawerHeader>
            <DrawerBody bg="#2e2e2d" color="white">
              <Link href="/dashboard" style={linkStyle}>
                <Box display="flex" alignItems="center" mr={4} mb={4}>
                  <Text>Dashboard</Text>
                </Box>
              </Link>
              <Link target="_blank" href={previewUrl} style={linkStyle}>
                <Box display="flex" alignItems="center" mr={4} mb={4}>
                  <Text>Preview</Text>
                </Box>
              </Link>
              <Link href="/insights" style={linkStyle}>
                <Box display="flex" alignItems="center" mr={4} mb={4}>
                  <Text>Insights</Text>
                </Box>
              </Link>
              <Link href="/account" style={linkStyle}>
                <Box display="flex" alignItems="center" mr={4} mb={4}>
                  <Text fontSize="1rem" mr={2}>
                    Account
                  </Text>
                  <Avatar size="sm" name={user.name} src={user.profilePic} />
                </Box>
              </Link>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      <Link href="/dashboard" style={linkStyle}>
        <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={4}>
          <Text fontSize="1.1rem">Dashboard</Text>
        </Box>
      </Link>
      <Link target="_blank" href={previewUrl} style={linkStyle}>
        <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={4}>
          <Text fontSize="1.1rem">Preview</Text>
        </Box>
      </Link>
      <Link href="/insights" style={linkStyle}>
        <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={4}>
          <Text fontSize="1.1rem">Insights</Text>
        </Box>
      </Link>
      <Spacer />
      <Link href="/account" style={linkStyle}>
        <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={4}>
          <Avatar size="md" name={user.username} src={user.profilePic} />
          <Text fontSize="1.2rem" ml={2}>
            Account
          </Text>
        </Box>
      </Link>
    </Flex>
  );
};

export default Navbar;
