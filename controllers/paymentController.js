const paymentService = require("../services/paymentService");
const { catchAsync } = require("../utils/error");

const getUserCartInfo = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const foodIds = req.body.foodId;

  const result = await paymentService.getUserCartInfo(userId, foodIds);

  if (!result) {
    error = new Error("CART_NOT_FOUND!!");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json(result);
});

const payment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { point, address } = req.body;

  if (!point || !address) {
    error = new Error("KEY_ERROR!");
    error.statusCode = 400;
    throw error;
  }

  const result = await paymentService.payment(userId, point, address);

  if (!result) {
    error = new Error("ORDER_FAILED!");
    error.statusCode = 400;
    throw error;
  }

  return res.status(200).json({ message: "ORDER_SUCCESS!" });
});

module.exports = {
  getUserCartInfo,
  payment,
};
