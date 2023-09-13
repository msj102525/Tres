const likesService = require("../services/likesService");
const { catchAsync } = require("../utils/error");

const createOrDeleteLike = catchAsync(async (req, res) => {
  const { userId, foodId } = req.body;

  if (!userId || !foodId) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;
    throw error;
  };

  const userLikes = await likesService.createOrDeleteLike(userId, foodId);
  const createdLikeId = !!parseInt(userLikes.insertId);

  if (!createdLikeId) return res.status(200).json({ message: "likeDeleted" });
  
  return res.status(201).json({ message: "likeCreated" });
});

module.exports = {
  createOrDeleteLike,
};
