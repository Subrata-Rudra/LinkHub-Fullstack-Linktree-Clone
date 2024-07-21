const expressAsyncHandler = require("express-async-handler");
const redis = require("../config/redis");
const { promisify } = require("util");
const User = require("../models/userModel");
const BasicDetails = require("../models/basicDetailsModel");
const Link = require("../models/linksModel");
const Visit = require("../models/visitModel");

const getFromRedisAsync = promisify(redis.get).bind(redis);

// Get All Details With All Links
const viewAll = expressAsyncHandler(async (req, res) => {
  const username = req.params.username;
  if (!username) {
    res.status(400).send("Please send the username");
    throw new Error("Please send the username");
  }

  let dataFoundInCache = false;

  // Implementing caching using Redis
  try {
    let data = await getFromRedisAsync(username);
    if (data !== null) {
      // console.log("Got the data in Redis");
      dataFoundInCache = true;

      // Sending the readymade(already rendered) LinkHub Page to the visitors
      res.status(200).render("linkhubPage", JSON.parse(data));

      await Visit.findOneAndUpdate(
        { username: username },
        { $inc: { visitCount: 1 } },
        { new: true }
      );
    }
  } catch (error) {
    console.log(
      "Error occurred in getting data from Redis. ERROR_DETAILS:",
      error
    );
  }

  if (dataFoundInCache === false) {
    // console.log("Fetching data from MongoDB...");
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

      res.status(200).render("linkhubPage", data);

      await redis.set(username, JSON.stringify(data)); // Converting the javascript object to string using stringify and storing it in Redis using the key of username(Format of storing: username(key) --> data(data))
      await redis.expire(username, 3600); // Storing(caching) the data to Redis and setting expiry time to 1 hour(3600 seconds)

      await Visit.findOneAndUpdate(
        { username: username },
        { $inc: { visitCount: 1 } },
        { new: true }
      );
    } else {
      res.status(200).render("linkhubNotExistPage");
    }
  }
});

module.exports = { viewAll };
