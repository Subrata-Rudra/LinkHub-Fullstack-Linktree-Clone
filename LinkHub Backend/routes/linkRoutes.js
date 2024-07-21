const express = require("express");
const {
  addBasicLinks,
  updateBasicLink,
  deleteBasicLink,
  getBasicLinks,
  addLinks,
  updateLink,
  deleteLink,
  getLinks,
} = require("../controllers/linksController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/add-basic-links").post(protect, addBasicLinks);
router.route("/update-basic-link").put(protect, updateBasicLink);
router.route("/delete-basic-link").delete(protect, deleteBasicLink);
router.route("/get-basic-links").get(protect, getBasicLinks);
router.route("/add-links").post(protect, addLinks);
router.route("/update-link").put(protect, updateLink);
router.route("/delete-link").delete(protect, deleteLink);
router.route("/get-links").get(protect, getLinks);

module.exports = router;
