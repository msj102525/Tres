const likesDao = require("../models/likesDao");

const createOrDeleteLike = async (userId, foodId) => {
  const likeExists = await likesDao.likeExists(userId, foodId);

  if (likeExists) return await likesDao.deleteLike(userId, foodId);

  return await likesDao.createLike(userId, foodId);
};

module.exports = {
  createOrDeleteLike,
};