const paymentDao = require("../models/paymentDao");

const getUserCartInfo = async (userId, foodIds) => {
  const userInfoResult = await paymentDao.getUserInfo(userId);

  if (!userInfoResult) {
    const error = new Error("USER_INFO_NOT_FOUND");
    error.statusCode = 409;
    throw error;
  }

  const foodInfoResult = await paymentDao.getCartFoodInfo(userId, foodIds);

  if (!foodInfoResult) {
    const error = new Error("FOOD_INFO_NOT_FOUND");
    error.statusCode = 409;
    throw error;
  }

  userInfoResult[0].food = foodInfoResult;

  return userInfoResult;
};

const payment = async (userId, point, address) => {
  const userAddressInDB = await paymentDao.checkAddress(userId);

  if (address !== userAddressInDB)
    await paymentDao.updateAddress(userId, address);

  const userPoints = await paymentDao.checkPoint(userId);

  if (userPoints < point) {
    const error = new Error("NOT_ENOUGH_POINT");
    error.statusCode = 409;
    throw error;
  }

  return await paymentDao.payment(userId, point);
};

module.exports = {
  getUserCartInfo,
  payment,
};
