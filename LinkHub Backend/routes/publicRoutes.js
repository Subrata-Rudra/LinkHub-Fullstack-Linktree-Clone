const express = require("express");
const {
  baseRouteHandler,
  viewAll,
} = require("../controllers/publicController");
const router = express.Router();

router.route("/").get(baseRouteHandler); // To handle response for the base route
router.route("/:username").get(viewAll); // To serve LinkHub to visitors

module.exports = router;
