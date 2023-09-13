const orderService = require("../services/orderService");
const { catchAsync } = require("../utils/error");

const addCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const foodId = req.body.foodId;
  const count = req.body.count;
  const price = req.body.price;

  if (!foodId || !count || !price)
    return res.status(400).json({ message: "KEY ERROR" });

  const result = await orderService.addCart(userId, foodId, count, price);

  if (!result) {
    error = new Error("COULD NOT ADD TO CART");
    error.statusCode = 400;
    throw error;
  }

  return res.status(200).json({ message: "ADD_CART_SUCCESS" });
});

const getCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await orderService.getCart(userId);

  if (!result) {
    error = new Error("GET_CART_CONTROLLER_ERROR");
    error.statusCode = 400;
    throw error;
  }

  return res.status(200).json(result);
});

const modifyOrderCount = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { foodId, quantity } = req.body;

  if (!foodId && !quantity) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;
    throw error;
  }

  await orderService.modifyOrderCount(foodId, quantity, userId);

  return res.status(200).json({ message: "ORDER MODIFIED" });
});

const deleteOrder = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const deleteOrderItem = req.query.foodId.split(",");
  console.log(deleteOrderItem);
  if (!deleteOrderItem) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;
    throw error;
  }

  const result = await orderService.deleteOrder(deleteOrderItem, userId);

  if (result) return res.status(200).json({ message: "ORDER DELETED" });

  return res.status(400).json({ message: "NO MODIFICATIONS MADE" });
});

module.exports = { addCart, getCart, modifyOrderCount, deleteOrder };
