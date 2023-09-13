const orderDao = require("../models/orderDao");

const addCart = async (userId, foodId, count, price) => {
  try {
    const foodExists = await orderDao.foodExists(userId, foodId);

    if (foodExists) await orderDao.updateFoodCount(userId, foodId, count);
   
    return await orderDao.addCart(userId, foodId, count, price);
  } catch (error) {
    error = new Error("NOT ABLE TO ADD TO CART");
    error.statusCode = 400;
    throw error;
  };
};

const getCart = async (userId) => {
  return await orderDao.getCart(userId);
};

const modifyOrderCount = async (foodId, quantity, userId) => {
  return await orderDao.modifyOrderCount(foodId, quantity, userId);
};

const deleteOrder = async (deleteOrderItem, userId) => {
  try{
    const isExist = await orderDao.checkDeleteQuery(deleteOrderItem, userId);

    const inputLength = deleteOrderItem.length;
    const isExistLength = isExist.length;
  
    if (inputLength !== isExistLength) return false;
  
    await orderDao.deleteOrderItems(deleteOrderItem, userId);
  
    return true;
      
  } catch (error) {
    console.log(error);
    err = new Error("NOT ABLE TO ADD TO CART");
    err.statusCode = 400;
    throw err;
  };
};

module.exports = { modifyOrderCount, deleteOrder, addCart, getCart };
