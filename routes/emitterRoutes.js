const express = require("express");
const router = express.Router();

const emitterController = require("../controllers/emitterController");

router.route("/").get(emitterController.sendEncryptedMessage);

module.exports = router;
