const expressAsyncHandler = require("express-async-handler");
const redis = require("../config/redis");
const User = require("../models/userModel");
const Visit = require("../models/visitModel");
const BasicDetails = require("../models/basicDetailsModel");
const Link = require("../models/linksModel");
const Subscriber = require("../models/subscriberModel");
const axios = require("axios");

// Update Redis with the updated data
const updateRedis = expressAsyncHandler(async (username) => {
  const profilePic = await User.findOne({ username: username }).select(
    "profilePic"
  );
  const hub = await Visit.findOne({ username: username });
  const basicLinks = await BasicDetails.find({ username: username }).sort({
    createdAt: 1,
  });
  const links = await Link.find({ username: username }).sort({
    createdAt: 1,
  });
  if (hub) {
    // res.status(200).json({ hub: hub, basicLinks: basicLinks, links: links });
    data = {
      username: username,
      profilePic: profilePic,
      hub: hub,
      basicLinks: basicLinks,
      links: links,
    };

    await redis.set(username, JSON.stringify(data)); // Converting the javascript object to string using stringify and storing it in Redis using the key of username(Format of storing: username(key) --> data(data))
    await redis.expire(username, 3600); // Storing(caching) the data to Redis and setting expiry time to 1 hour(3600 seconds)
  }
});

// Add Basic Link(s)
const addBasicLinks = expressAsyncHandler(async (req, res) => {
  // const { username, linksData } = req.body;
  const { linksData } = req.body;
  const username = req.user.username;
  if (linksData.length === 0) {
    res.status(400).send("Please send all the required details");
    throw new Error("Please send all the required details");
  }
  let cnt = 0;
  for (const item of linksData) {
    const { displayName, link } = item;
    try {
      const existingDocument = await BasicDetails.find({
        username: username,
        $or: [{ link: link }, { displayName: displayName }],
      });
      if (existingDocument.length === 0) {
        await BasicDetails.create({ username, displayName, link });
      } else {
        cnt = cnt + 1;
      }
    } catch (error) {
      res.status(500).send("Error occured in adding basic link");
      throw new Error(error);
    }
  }
  let n = linksData.length - cnt;
  res
    .status(200)
    .send(
      `Total basic link(s) send: ${linksData.length}\n${n} basic link(s) added\n${cnt} basic link(s) are not added because they were causing duplicacy.`
    );

  // To send updates about adding new links to all the subscribers
  if (n > 0) {
    // Updating Redis so that the user can see the changes instantly
    updateRedis(username);
    try {
      const channel = await Subscriber.findOne({ username });
      if (channel && channel.email.length > 0) {
        const apiUrl = "http://localhost:8000/"; // Mail sending endpoint url of mail sender server which is on another service
        const postData = {
          username: username,
          linkCount: n,
        };
        axios
          .post(apiUrl, postData)
          .then((response) => {})
          .catch((err) => {
            console.error("Error: ", err);
          });
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }
});

// Update A Basic Link
const updateBasicLink = expressAsyncHandler(async (req, res) => {
  const { id, displayName, link } = req.body;
  const username = req.user.username;
  if (!id || !displayName || !link) {
    res.status(400).send("Please send all the required details");
    throw new Error("Please send all the required details");
  }
  try {
    const links = await BasicDetails.findOne({
      username: username,
      _id: id,
    });
    if (!links) {
      return res.status(401).send("You are not the owner of this link.");
    }
  } catch (error) {
    res.status(500).send("Failed to find the basic link");
    throw new Error(error);
  }
  try {
    const updatedLink = await BasicDetails.findByIdAndUpdate(
      id,
      { displayName: displayName, link: link },
      { new: true }
    );
    if (updatedLink) {
      res.status(200).send("Basic link updated");
      // Updating Redis so that the user can see the changes instantly
      updateRedis(username);
    } else {
      res.status(404).send("Basic link not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update basic link");
    throw new Error(error);
  }
});

// Delete A Basic Link
const deleteBasicLink = expressAsyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.status(400).send("Please send the id of the basic link");
  }
  const username = req.user.username;
  try {
    const links = await BasicDetails.findOne({
      username: username,
      _id: id,
    });
    if (!links) {
      return res.status(401).send("You are not the owner of this link.");
    }
  } catch (error) {
    res.status(500).send("Failed to find basic link");
    throw new Error(error);
  }
  try {
    const deletedBasicLink = await BasicDetails.findByIdAndDelete(id);
    if (deletedBasicLink) {
      // Updating Redis so that the user can see the changes instantly
      updateRedis(username);
      res.status(200).send("Basic link deleted");
    } else {
      res.status(404).send("Basic link not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete the basic link");
    throw new Error(error);
  }
});

// To get all basic links
const getBasicLinks = expressAsyncHandler(async (req, res) => {
  const username = req.user.username;
  try {
    const basicLinks = await BasicDetails.find({ username });
    res.status(200).send(basicLinks);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

// Add Link(s)
const addLinks = expressAsyncHandler(async (req, res) => {
  const { linksData } = req.body;
  if (linksData.length === 0) {
    res.status(400).send("Please send all the required details");
    throw new Error("Please send all the required details");
  }
  const username = req.user.username;
  let cnt = 0;
  for (const item of linksData) {
    const { displayName, link } = item;
    try {
      const existingDocument = await Link.find({
        username: username,
        $or: [{ link: link }, { displayName: displayName }],
      });
      if (existingDocument.length === 0) {
        await Link.create({ username, displayName, link });
      } else {
        cnt = cnt + 1;
      }
    } catch (error) {
      res.status(500).send("Error occured in adding link");
      throw new Error(error);
    }
  }
  let n = linksData.length - cnt;
  res
    .status(200)
    .send(
      `Total link(s) send: ${linksData.length}\n${n} link(s) added\n${cnt} link(s) are not added becaause they were causing duplicacy.`
    );

  // To send updates about adding new links to all the subscribers
  if (n > 0) {
    // Updating Redis so that the user can see the changes instantly
    updateRedis(username);
    try {
      const channel = await Subscriber.findOne({ username });
      if (channel && channel.email.length > 0) {
        const apiUrl = "http://localhost:8000/"; // Mail sending endpoint url of mail sender server which is on another service
        const postData = {
          username: username,
          linkCount: n,
        };
        axios
          .post(apiUrl, postData)
          .then((response) => {})
          .catch((err) => {
            console.error("Error: ", err);
          });
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }
});

// Update A Link
const updateLink = expressAsyncHandler(async (req, res) => {
  const { id, displayName, link } = req.body;
  const username = req.user.username;
  if (!id || !displayName || !link) {
    res.status(400).send("Please send all the required details");
    throw new Error("Please send all the required details");
  }
  try {
    const links = await Link.findOne({
      username: username,
      _id: id,
    });
    if (!links) {
      return res.status(401).send("You are not the owner of this link.");
    }
  } catch (error) {
    res.status(500).send("Failed to find the link");
    throw new Error(error);
  }
  try {
    const updatedLink = await Link.findByIdAndUpdate(
      id,
      { displayName: displayName, link: link },
      { new: true }
    );
    if (updatedLink) {
      updateRedis(username);
      res.status(200).send("Link updated");
    } else {
      res.status(404).send("Link not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update link");
    throw new Error(error);
  }
});

// Delete A Link
const deleteLink = expressAsyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.status(400).send("Please send the id of the link");
  }
  const username = req.user.username;
  try {
    const links = await Link.findOne({
      username: username,
      _id: id,
    });
    if (!links) {
      return res.status(401).send("You are not the owner of this link.");
    }
  } catch (error) {
    res.status(500).send("Failed to find the link");
    throw new Error(error);
  }
  try {
    const deletedLink = await Link.findByIdAndDelete(id);
    if (deletedLink) {
      // Updating Redis so that the user can see the changes instantly
      updateRedis(username);
      res.status(200).send("Link deleted");
    } else {
      res.status(404).send("Link not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete the link");
    throw new Error(error);
  }
});

// To get all links
const getLinks = expressAsyncHandler(async (req, res) => {
  const username = req.user.username;
  try {
    const links = await Link.find({ username });
    res.status(200).send(links);
  } catch (error) {
    res.status(500).send("Internal server error");
    console.error(error);
  }
});

module.exports = {
  addBasicLinks,
  updateBasicLink,
  deleteBasicLink,
  getBasicLinks,
  addLinks,
  updateLink,
  deleteLink,
  getLinks,
};
