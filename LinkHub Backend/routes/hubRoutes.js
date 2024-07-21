const express = require("express");
const { createHub, updateHub, getVisitCount } = require("../controllers/hubController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/createHub").post(protect, createHub);
router.route("/updateHub").put(protect, updateHub);
router.route("/visitCount").get(protect, getVisitCount);

module.exports = router;
