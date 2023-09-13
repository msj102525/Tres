const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/email-check", userController.userEmailCheck);
router.post("/login", userController.login);
router.get("", userController.getCountriesList);
router.post("", userController.signUp);

module.exports = { router };
