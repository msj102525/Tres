const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authorization } = require("../utils/authorization");

router.post("/checkout", authorization, paymentController.getUserCartInfo);
router.post("", authorization, paymentController.payment);

module.exports = { router };
