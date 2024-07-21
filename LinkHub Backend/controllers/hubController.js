const expressAsyncHandler = require("express-async-handler");
const Visit = require("../models/visitModel");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const redis = require("../config/redis");
const BasicDetails = require("../models/basicDetailsModel");
const Link = require("../models/linksModel");

// // Check if hub exists or not
// const checkHub = expressAsyncHandler(async (req, res) => {
//   const username = req.query.username;
//   if (!username) {
//     res.status(400).send("No username");
//   } else {
//     const existHub = await Visit.findOne({ username: username });
//     if (existHub) {
//       res.status(200).send("Yes, hub exists");
//     } else {
//       res.status(201).send("No, hub does not exist");
//     }
//   }
// });

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

// Create LinkHub To Publish
const createHub = expressAsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const username = req.user.username;
  const existingHub = await Visit.findOne({ username: username });
  if (existingHub) {
    res
      .status(200)
      .send(
        `Linkhub already exists for this username. Linkhub is here: http://localhost:5000/${username}`
      );
  } else {
    let hub;
    if (!title) {
      const title = username;
      hub = await Visit.create({
        username,
        title,
        description,
      });
    } else {
      hub = await Visit.create({
        username,
        title,
        description,
      });
    }
    const user = await User.findOne({ username });
    // res.status(201).send(`Linkhub created: http://localhost:5000/${username}`);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      hubExist: true,
      hubTitle: hub.title,
      hubDesc: hub.description,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  }
});

// Update LinkHub Title, Description
const updateHub = expressAsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).send("Please send all the required details");
    throw new Error("Please send all the required details");
  }
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });
    const hub = await Visit.findOneAndUpdate(
      { username: username },
      { title: title, description: description },
      { new: true }
    );
    // Updating Redis so that the user can see the changes instantly
    updateRedis(username);
    // res.status(200).send("Updated Linkhub details");
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      hubExist: true,
      hubTitle: hub.title,
      hubDesc: hub.description,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).send("Failed to update Linkhub details");
    throw new Error(error);
  }
});

// To get views count of hub
const getVisitCount = expressAsyncHandler(async (req, res) => {
  const username = req.user.username;
  try {
    const hub = await Visit.findOne({ username });
    const visitCount = hub ? hub.visitCount : 0;
    res.status(200).json({ visitCount });
  } catch (error) {
    res.status(500).send("Error in getting hub data.");
    console.error(error);
  }
});

module.exports = { createHub, updateHub, getVisitCount };
