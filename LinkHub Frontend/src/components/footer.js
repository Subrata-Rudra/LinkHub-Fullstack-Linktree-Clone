import { Container, Link, Stack, Text } from "@chakra-ui/react";
import { React } from "react";

const Footer = () => {
  return (
    <Container
      as={Stack}
      maxW={"6xl"}
      mt={{ base: "10px", md: "50px" }}
      py={4}
      backgroundColor="black"
      direction={{ base: "column", md: "row" }}
      spacing={4}
      justify={{ base: "center", md: "space-between" }}
      align={{ base: "center", md: "center" }}
    >
      <Stack
        color="white"
        fontFamily="monospace"
        fontWeight="bold"
        direction={"row"}
        fontSize={{ base: ".9rem", md: "1.1rem" }}
        spacing={6}
      >
        <Link href={"https://github.com/Subrata-Rudra"} target="_blank">
          {"<"}Source_Code{"/"}
          {">"}
        </Link>
        <Link
          href={"https://www.linkedin.com/in/subrata-rudra-b481741b7/"}
          target="_blank"
        >
          LinkedIn
        </Link>
        <Link href={"https://twitter.com/SubrataRudra18"} target="_blank">
          Twitter
        </Link>
      </Stack>
      <Text
        color="white"
        fontFamily="monospace"
        fontWeight="bold"
        fontSize={{ base: ".9rem", md: "1.1rem" }}
      >
        {/* Developed by Subrata Rudra */}
        Developed with🤍 by{" "}
        <Link href={"https://github.com/Subrata-Rudra"} target="_blank">
          Subrata Rudra
        </Link>
      </Text>
    </Container>
  );
};

export default Footer;
