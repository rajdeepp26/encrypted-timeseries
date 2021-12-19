const express = require("express");
const router = express.Router();

const listenerController = require("../controllers/listenerController");

router.route("/").post(listenerController.readEncryptedMessage);
router.route("/get-ui").get(listenerController.sendFormToGetEncryptedMessage);

module.exports = router;
