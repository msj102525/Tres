const dataSource = require("./dataSource");

const likeExists = async (userId, foodId) => {
  try {
    const [likeExists] = await dataSource.query(
      `
      SELECT EXISTS (
      SELECT * FROM likes 
      WHERE (
      user_id = ? AND food_id = ?
      )
      )
      `, [userId, foodId]
    );
    const [result] = Object.values(likeExists);
    return !!parseInt(result);
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  }
};

const deleteLike = async (userId, foodId) => {
  try {
    return await dataSource.query(
      `
      DELETE FROM likes
      WHERE user_id = ? AND food_id = ?
      `, [userId, foodId]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  };
};

const createLike = async (userId, foodId) => {
  try {
    return await dataSource.query(
      `
      INSERT INTO likes (
        user_id,
        food_id
      ) VALUES (?, ?)
      `, [userId, foodId]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  };
};

module.exports = {
  likeExists,
  deleteLike,
  createLike,
};
