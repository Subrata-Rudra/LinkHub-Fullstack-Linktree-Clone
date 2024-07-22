import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import "../dashboardPage.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
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
  useToast,
} from "@chakra-ui/react";
import serverConfig from "../utils/serverConfig";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [name, setName] = useState({});
  const [description, setDescription] = useState({});
  const [basicLinks, setBasicLinks] = useState({});
  const [links, setLinks] = useState({});
  const [rowId, setRowId] = useState();
  const [rowName, setRowName] = useState();
  const [rowUrl, setRowUrl] = useState();
  const [rowNum, setRowNum] = useState();
  const [isBasicLink, setIsBasicLink] = useState();
  const [hubTitle, setHubTitle] = useState();
  const [hubDesc, setHubDesc] = useState();
  const [profilePic, setProfilePic] = useState();
  const [loading, setLoading] = useState();
  const [addBasicLinks, setAddBasicLinks] = useState([]);
  const [addLinks, setAddLinks] = useState([]);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isAddBasicLink, setIsAddBasicLink] = useState();
  const toast = useToast();
  const {
    isOpen: isActivateModalOpen,
    onOpen: onActivateModalOpen,
    onClose: onActivateModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditRowModalOpen,
    onOpen: onEditRowModalOpen,
    onClose: onEditRowModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditTitleModalOpen,
    onOpen: onEditTitleModalOpen,
    onClose: onEditTitleModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditDescriptionModalOpen,
    onOpen: onEditDescriptionModalOpen,
    onClose: onEditDescriptionModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditProfilePicModalOpen,
    onOpen: onEditProfilePicModalOpen,
    onClose: onEditProfilePicModalClose,
  } = useDisclosure();
  const {
    isOpen: isAddBasicLinksModalOpen,
    onOpen: onAddBasicLinksModalOpen,
    onClose: onAddBasicLinksModalClose,
  } = useDisclosure();
  const {
    isOpen: isAddLinksModalOpen,
    onOpen: onAddLinksModalOpen,
    onClose: onAddLinksModalClose,
  } = useDisclosure();

  // If the user is not logged in, then redirect to Landing Page
  useEffect(() => {
    let linkhubUser = JSON.parse(localStorage.getItem("LinkhubUserInfo"));
    if (!linkhubUser) {
      navigate("/");
    } else {
      setUser(linkhubUser);
    }
  }, [navigate]);

  const getBasicLinks = useCallback(async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const url = serverConfig + "link/get-basic-links";
      const response = await axios.get(url, config);
      setBasicLinks(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  const getLinks = useCallback(async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const url = serverConfig + "link/get-links";
      const response = await axios.get(url, config);
      setLinks(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !user.token) {
      return;
    }
    getBasicLinks();
    getLinks();
  }, [user, getBasicLinks, getLinks]);

  const createHub = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataToSend = {
        title: name,
        description: description,
      };
      const url = serverConfig + "hub/createHub";
      const response = await axios.post(url, dataToSend, config);
      localStorage.setItem("LinkhubUserInfo", JSON.stringify(response.data));
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLink = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      let url;
      if (isBasicLink === true) {
        url = serverConfig + "link/delete-basic-link?id=" + rowId;
      } else if (isBasicLink === false) {
        url = serverConfig + "link/delete-link?id=" + rowId;
      }
      const response = await axios.delete(url, config);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log("Error occurred in deleting link. ERROR_DETAILS: ", error);
    }
  };

  const deleteButtonHandler = (id, name, url, index, isBasicLink) => {
    setRowId(id);
    setRowName(name);
    setRowUrl(url);
    setRowNum(index);
    setIsBasicLink(isBasicLink);
    onDeleteModalOpen();
  };

  const editLink = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataToSend = {
        id: rowId,
        displayName: rowName,
        link: rowUrl,
      };
      let url;
      if (isBasicLink === true) {
        url = serverConfig + "link/update-basic-link";
      } else if (isBasicLink === false) {
        url = serverConfig + "link/update-link";
      }
      const response = await axios.put(url, dataToSend, config);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log("Error occurred in updating link. ERROR_DETAILS: ", error);
    }
  };

  const editButtonHandler = (id, name, url, index, isBasicLink) => {
    setRowId(id);
    setRowName(name);
    setRowUrl(url);
    setRowNum(index);
    setIsBasicLink(isBasicLink);
    onEditRowModalOpen();
  };

  const editTitle = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataToSend = {
        title: hubTitle,
        description: hubDesc,
      };
      let url = serverConfig + "hub/updateHub";
      const response = await axios.put(url, dataToSend, config);
      if (response.status === 201) {
        localStorage.setItem("LinkhubUserInfo", JSON.stringify(response.data));
        window.location.reload();
      }
    } catch (error) {
      console.log(
        "Error occurred in updating hub title. ERROR_DETAILS: ",
        error
      );
    }
  };

  const editTitleButtonHandler = () => {
    setHubTitle(user.hubTitle);
    setHubDesc(user.hubDesc);
    onEditTitleModalOpen();
  };

  const editDescription = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataToSend = {
        title: hubTitle,
        description: hubDesc,
      };
      let url = serverConfig + "hub/updateHub";
      const response = await axios.put(url, dataToSend, config);
      if (response.status === 201) {
        localStorage.setItem("LinkhubUserInfo", JSON.stringify(response.data));
        window.location.reload();
      }
    } catch (error) {
      console.log(
        "Error occurred in updating hub description. ERROR_DETAILS: ",
        error
      );
    }
  };

  const editDescriptionButtonHandler = () => {
    setHubTitle(user.hubTitle);
    setHubDesc(user.hubDesc);
    onEditDescriptionModalOpen();
  };

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

  const editProfilePic = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataToSend = {
        newProfilePic: profilePic,
      };
      let url = serverConfig + "user/update-profile-pic";
      const response = await axios.put(url, dataToSend, config);
      if (response.status === 200) {
        user.profilePic = response.data.profilePic;
        const updatedUserInfo = JSON.stringify(user);
        localStorage.removeItem("LinkhubUserInfo");
        localStorage.setItem("LinkhubUserInfo", updatedUserInfo);
        window.location.reload();
      }
    } catch (error) {
      console.log(
        "Error occurred in updating profile picture. ERROR_DETAILS: ",
        error
      );
    }
  };

  const editProfilePicButtonHandler = () => {
    setProfilePic(user.profilePic);
    onEditProfilePicModalOpen();
  };

  const addLink = () => {
    if (linkName === "" || linkUrl === "") {
      return;
    }
    const link = {
      displayName: linkName,
      link: linkUrl,
    };
    if (isAddBasicLink === true) {
      setAddBasicLinks([...addBasicLinks, link]);
    } else {
      setAddLinks([...addLinks, link]);
    }
    setLinkName("");
    setLinkUrl("");
  };

  const deleteAddLinkButtonHandler = (name, link, isBasic) => {
    if (isBasic === true) {
      const updatedAddBasicLinks = addBasicLinks.filter((item) => {
        return item.name !== name && item.link !== link;
      });
      setAddBasicLinks(updatedAddBasicLinks);
    } else {
      const updatedAddLinks = addLinks.filter((item) => {
        return item.name !== name && item.link !== link;
      });
      setAddBasicLinks(updatedAddLinks);
    }
  };

  const addLinksSubmitHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      let dataToSend;
      let url;
      if (isAddBasicLink === true) {
        dataToSend = {
          linksData: addBasicLinks,
        };
        url = serverConfig + "link/add-basic-links";
      } else {
        dataToSend = {
          linksData: addLinks,
        };
        url = serverConfig + "link/add-links";
      }
      console.log("dataToSend: ", dataToSend);
      const response = await axios.post(url, dataToSend, config);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log("Error occurred in adding links. ERROR_DETAILS: ", error);
    }
  };

  const addBasicLinksButtonHandler = () => {
    setIsAddBasicLink(true);
    onAddBasicLinksModalOpen();
  };

  const addLinksButtonHandler = () => {
    setIsAddBasicLink(false);
    onAddLinksModalOpen();
  };

  return (
    <>
      <Navbar />
      <Box minHeight="67vh" fontFamily="monospace">
        {user.hubExist ? (
          <Box
            color="black"
            mt={{ base: "2rem", md: "8rem" }}
            bg="white"
            display="flex"
            justifyContent="center"
            p={{ base: "1rem", md: "2rem" }}
          >
            <VStack spacing={{ base: "1rem", md: "2rem" }}>
              <Text
                fontSize={{
                  base: "1rem",
                  md: "1.2rem",
                  lg: "1.5rem",
                  xl: "1.8rem",
                }}
                fontWeight="bold"
              >
                Profile Picture
              </Text>
              <Image
                id="profilePic"
                src={user.profilePic}
                width={{ base: "6rem", md: "8rem" }}
                borderRadius="50%"
              />
              <Button onClick={editProfilePicButtonHandler}>
                Edit Profile Picture &nbsp; <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Text
                fontSize={{
                  base: "1rem",
                  md: "1.2rem",
                  lg: "1.5rem",
                  xl: "1.8rem",
                }}
                fontWeight="bold"
              >
                Title: {user.hubTitle}{" "}
                <Button onClick={editTitleButtonHandler}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Text>
              <Text
                fontSize={{
                  base: "1rem",
                  md: "1.2rem",
                  lg: "1.5rem",
                  xl: "1.8rem",
                }}
                fontWeight="bold"
              >
                Description: {user.hubDesc}{" "}
                <Button onClick={editDescriptionButtonHandler}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Text>
              <Text className="table-name" color="blue">
                Basic Links
              </Text>
              <Box>
                {basicLinks.length > 0 ? (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>Link URL</th>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {basicLinks.map((basicLink, i) => (
                          <tr key={i}>
                            <td>{basicLink.link}</td>
                            <td>{basicLink.displayName}</td>
                            <td>
                              <button
                                onClick={() =>
                                  editButtonHandler(
                                    basicLink._id,
                                    basicLink.displayName,
                                    basicLink.link,
                                    i,
                                    true
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>{" "}
                              <button
                                onClick={() =>
                                  deleteButtonHandler(
                                    basicLink._id,
                                    basicLink.displayName,
                                    basicLink.link,
                                    i,
                                    true
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <Text fontSize="1rem">No basic links to show</Text>
                )}
                <Button marginTop="1rem" onClick={addBasicLinksButtonHandler}>
                  Add Basic Link &nbsp;
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Box>
              <Box>
                <Text className="table-name" color="green">
                  Links
                </Text>
                {links.length > 0 ? (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>Link URL</th>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {links.map((link, i) => (
                          <tr key={i}>
                            <td>{link.link}</td>
                            <td>{link.displayName}</td>
                            <td>
                              <button
                                onClick={() =>
                                  editButtonHandler(
                                    link._id,
                                    link.displayName,
                                    link.link,
                                    i,
                                    false
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>{" "}
                              <button
                                onClick={() =>
                                  deleteButtonHandler(
                                    link._id,
                                    link.displayName,
                                    link.link,
                                    i,
                                    false
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <Text fontSize="1rem">No links to show</Text>
                )}
                <Button marginTop="1rem" onClick={addLinksButtonHandler}>
                  Add Link &nbsp;
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Box>
            </VStack>
            <Modal
              isOpen={isDeleteModalOpen}
              onClose={onDeleteModalClose}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                textAlign="center"
                maxW={{ base: "95%", md: "lg", lg: "2xl" }}
              >
                <ModalHeader fontSize="1.4rem">
                  Do you want to delete row number {rowNum + 1} ?
                </ModalHeader>
                <ModalBody fontSize="1rem">
                  <VStack spacing="5px" wordBreak="break-all">
                    <Text>
                      Link Name: <Text fontWeight="bold">{rowName}</Text>
                    </Text>
                    <Text>
                      Link URL: <Text fontWeight="bold">{rowUrl}</Text>
                    </Text>
                    <Box
                      display="flex"
                      flexDir="row"
                      style={{ marginTop: 17, marginBottom: 4 }}
                    >
                      <Button
                        colorScheme="red"
                        mr="1.5rem"
                        onClick={() => deleteLink()}
                      >
                        Delete
                      </Button>
                      <Button colorScheme="green" onClick={onDeleteModalClose}>
                        Cancel
                      </Button>
                    </Box>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isEditRowModalOpen}
              onClose={onEditRowModalClose}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                textAlign="center"
                maxW={{ base: "95%", md: "lg", lg: "2xl" }}
              >
                <ModalHeader fontSize="1.4rem">
                  Edit row number {rowNum + 1} ?
                </ModalHeader>
                <ModalBody fontSize="1rem">
                  <VStack spacing="5px" wordBreak="break-all">
                    <FormControl id="linkName" isRequired>
                      <FormLabel>Link Name</FormLabel>
                      <Input
                        value={rowName}
                        onChange={(e) => {
                          setRowName(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormControl id="linkUrl" isRequired>
                      <FormLabel>Link URL</FormLabel>
                      <Input
                        value={rowUrl}
                        onChange={(e) => {
                          setRowUrl(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Box
                      display="flex"
                      flexDir="row"
                      style={{ marginTop: 17, marginBottom: 4 }}
                    >
                      <Button
                        colorScheme="blue"
                        mr="1.5rem"
                        onClick={() => editLink()}
                      >
                        Save
                      </Button>
                      <Button colorScheme="red" onClick={onEditRowModalClose}>
                        Cancel
                      </Button>
                    </Box>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isEditTitleModalOpen}
              onClose={onEditTitleModalClose}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                textAlign="center"
                maxW={{ base: "95%", md: "lg", lg: "2xl" }}
              >
                <ModalHeader fontSize="1.4rem">Edit LinkHub Title</ModalHeader>
                <ModalBody fontSize="1rem">
                  <VStack spacing="5px" wordBreak="break-all">
                    <FormControl id="title" isRequired>
                      <FormLabel>LinkHub Title</FormLabel>
                      <Input
                        value={hubTitle}
                        onChange={(e) => {
                          setHubTitle(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Box
                      display="flex"
                      flexDir="row"
                      style={{ marginTop: 17, marginBottom: 4 }}
                    >
                      <Button
                        colorScheme="blue"
                        mr="1.5rem"
                        onClick={() => editTitle()}
                      >
                        Save
                      </Button>
                      <Button colorScheme="red" onClick={onEditTitleModalClose}>
                        Cancel
                      </Button>
                    </Box>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isEditDescriptionModalOpen}
              onClose={onEditDescriptionModalClose}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                textAlign="center"
                maxW={{ base: "95%", md: "lg", lg: "2xl" }}
              >
                <ModalHeader fontSize="1.4rem">
                  Edit LinkHub Description
                </ModalHeader>
                <ModalBody fontSize="1rem">
                  <VStack spacing="5px" wordBreak="break-all">
                    <FormControl id="title" isRequired>
                      <FormLabel>LinkHub Description</FormLabel>
                      <Input
                        value={hubDesc}
                        onChange={(e) => {
                          setHubDesc(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Box
                      display="flex"
                      flexDir="row"
                      style={{ marginTop: 17, marginBottom: 4 }}
                    >
                      <Button
                        colorScheme="blue"
                        mr="1.5rem"
                        onClick={() => editDescription()}
                      >
                        Save
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={onEditDescriptionModalClose}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isEditProfilePicModalOpen}
              onClose={onEditProfilePicModalClose}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                textAlign="center"
                maxW={{ base: "95%", md: "lg", lg: "2xl" }}
              >
                <ModalHeader fontSize="1.4rem">
                  Edit Profile Picture
                </ModalHeader>
                <ModalBody fontSize="1rem">
                  <VStack spacing="5px" wordBreak="break-all">
                    <FormControl id="pic" isRequired>
                      <FormLabel>Upload Your Picture</FormLabel>
                      <Input
                        type="file"
                        p={1.5}
                        accept="image/*"
                        onChange={(e) => postDetails(e.target.files[0])}
                      />
                    </FormControl>
                    <Box
                      display="flex"
                      flexDir="row"
                      style={{ marginTop: 17, marginBottom: 4 }}
                    >
                      <Button
                        colorScheme="blue"
                        mr="1.5rem"
                        onClick={() => editProfilePic()}
                        isLoading={loading}
                      >
                        Save
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={onEditProfilePicModalClose}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isAddBasicLinksModalOpen}
              onClose={onAddBasicLinksModalClose}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                textAlign="center"
                maxW={{ base: "95%", md: "lg", lg: "2xl" }}
              >
                <ModalHeader fontSize="1.4rem">Add Basic Links</ModalHeader>
                <ModalBody fontSize="1rem">
                  <VStack spacing="5px" wordBreak="break-all">
                    <Box>
                      {addBasicLinks.length > 0 && (
                        <table>
                          <thead>
                            <tr>
                              <th>Link URL</th>
                              <th>Name</th>
                              <th>Remove</th>
                            </tr>
                          </thead>
                          <tbody>
                            {addBasicLinks.map((addBasicLink, i) => (
                              <tr key={i}>
                                <td>{addBasicLink.link}</td>
                                <td>{addBasicLink.displayName}</td>
                                <td>
                                  <button
                                    onClick={() =>
                                      deleteAddLinkButtonHandler(
                                        addBasicLink.displayName,
                                        addBasicLink.link,
                                        true
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </Box>
                    <FormControl id="linkUrl" isRequired>
                      <FormLabel>Link URL</FormLabel>
                      <Input
                        placeholder="Enter link url"
                        onChange={(e) => {
                          setLinkUrl(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormControl id="linkName" isRequired>
                      <FormLabel>Link Name</FormLabel>
                      <Input
                        placeholder="Enter link name"
                        onChange={(e) => {
                          setLinkName(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Button onClick={() => addLink()}>
                      Add &nbsp;
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Box
                      display="flex"
                      flexDir="row"
                      style={{ marginTop: 17, marginBottom: 4 }}
                    >
                      <Button
                        colorScheme="blue"
                        mr="1.5rem"
                        onClick={() => addLinksSubmitHandler()}
                      >
                        Submit
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={onAddBasicLinksModalClose}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isAddLinksModalOpen}
              onClose={onAddLinksModalClose}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                textAlign="center"
                maxW={{ base: "95%", md: "lg", lg: "2xl" }}
              >
                <ModalHeader fontSize="1.4rem">Add Links</ModalHeader>
                <ModalBody fontSize="1rem">
                  <VStack spacing="5px" wordBreak="break-all">
                    <Box>
                      {addLinks.length > 0 && (
                        <table>
                          <thead>
                            <tr>
                              <th>Link URL</th>
                              <th>Name</th>
                              <th>Remove</th>
                            </tr>
                          </thead>
                          <tbody>
                            {addLinks.map((addLink, i) => (
                              <tr key={i}>
                                <td>{addLink.link}</td>
                                <td>{addLink.displayName}</td>
                                <td>
                                  <button
                                    onClick={() =>
                                      deleteAddLinkButtonHandler(
                                        addLink.displayName,
                                        addLink.link,
                                        false
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </Box>
                    <FormControl id="linkUrl" isRequired>
                      <FormLabel>Link URL</FormLabel>
                      <Input
                        placeholder="Enter link url"
                        value={linkUrl}
                        onChange={(e) => {
                          setLinkUrl(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormControl id="linkName" isRequired>
                      <FormLabel>Link Name</FormLabel>
                      <Input
                        placeholder="Enter link name"
                        value={linkName}
                        onChange={(e) => {
                          setLinkName(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Button onClick={() => addLink()}>
                      Add &nbsp;
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Box
                      display="flex"
                      flexDir="row"
                      style={{ marginTop: 17, marginBottom: 4 }}
                    >
                      <Button
                        colorScheme="blue"
                        mr="1.5rem"
                        onClick={() => addLinksSubmitHandler()}
                      >
                        Submit
                      </Button>
                      <Button colorScheme="red" onClick={onAddLinksModalClose}>
                        Cancel
                      </Button>
                    </Box>
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        ) : (
          <Box>
            <Modal
              isOpen={isActivateModalOpen}
              onClose={onActivateModalClose}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent
                textAlign="center"
                maxW={{ base: "95%", md: "lg", lg: "2xl" }}
              >
                <ModalHeader fontSize="1.4rem">
                  Activate Your LinkHub
                </ModalHeader>
                <ModalBody fontSize="1rem">
                  <VStack spacing="5px">
                    <FormControl id="name" isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input
                        placeholder="Name"
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormControl id="description" isRequired>
                      <FormLabel>Short Description</FormLabel>
                      <Input
                        placeholder="Short Description"
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Button
                      colorScheme="green"
                      width="100%"
                      style={{ marginTop: 17, marginBottom: 4 }}
                      onClick={createHub}
                    >
                      Activate
                    </Button>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="red"
                    fontSize=".9rem"
                    padding=".2rem .6rem"
                    mr={3}
                    onClick={onActivateModalClose}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Box
              minHeight="85vh"
              display="flex"
              justifyContent="center"
              flexDir="column"
              textAlign="center"
              alignItems="center"
              fontFamily="monospace"
            >
              <Text
                fontWeight="bold"
                fontSize="1.5rem"
                margin="1rem"
                padding=".5rem"
              >
                You don't have Hub for your account. Create a Hub and share all
                your important links you want to share to your audiences,
                customers, followers.
              </Text>
              <Button
                colorScheme="green"
                fontSize="1.4rem"
                marginTop="1rem"
                onClick={onActivateModalOpen}
              >
                Create Hub
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default DashboardPage;
