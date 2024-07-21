const express = require("express");
const { viewAll } = require("../controllers/publicController");
const router = express.Router();

router.route("/:username").get(viewAll); // To serve LinkHub to visitors

module.exports = router;
