const express = require("express");
const {
  subscribeRequest,
  verifySubscriber,
  unsubscribeRequest,
  subscriberCount,
} = require("../controllers/subscribeController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/request").get(subscribeRequest); // To request for subscribe from visitors
router.route("/verify").get(verifySubscriber); // To verify the email of subscriber
router.route("/unsubscribeRequest").get(unsubscribeRequest); // To verify the email of subscriber
router.route("/subscriber-count").get(protect, subscriberCount); // To get the count of subscriber(s)

module.exports = router;
