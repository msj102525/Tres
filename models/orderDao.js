const dataSource = require("./dataSource");
const orderStatusEnum = require("./enum");

const foodExists = async (userId, foodId) => {
  try {
    const [foodExists] = await dataSource.query(
      `
      SELECT EXISTS (
        SELECT * FROM order_items oi
        JOIN orders o ON o.order_items_id = oi.id
        WHERE user_id = ? AND food_id = ?
      )`,
      [userId, foodId]
    );
    const [result] = Object.values(foodExists);
    return !!parseInt(result);
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  }
};

const addCart = async (userId, foodId, count, price) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const orderItemsResult = await queryRunner.query(
      `
      INSERT INTO order_items (
        order_price,
        order_count,
        food_id
      ) VALUES (?, ?, ?);
      `,
      [price, count, foodId]
    );
    await queryRunner.query(
      `
      INSERT INTO orders (
        user_id,
        order_items_id
      ) VALUES (?, ?);
      `,
      [userId, orderItemsResult.insertId]
    );

    await queryRunner.commitTransaction();
    return true;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const updateFoodCount = async (userId, foodId, count) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();

  try {
    await queryRunner.query(
      `
      UPDATE order_items oi
      JOIN orders o ON o.order_items_id = oi.id
      JOIN foods f ON f.id = oi.food_id
      SET oi.order_count = oi.order_count + ?
      WHERE oi.food_id = ?
      AND o.user_id = ?
      `,
      [count, foodId, userId]
    );

    await queryRunner.query(
      `
      UPDATE order_items oi
      JOIN orders o ON o.order_items_id = oi.id
      JOIN foods ON foods.id = oi.food_id
      SET oi.order_price = oi.order_count * foods.price
      WHERE oi.food_id = ?
      AND o.user_id = ?
      `,
      [foodId, userId]
    );

    await queryRunner.commitTransaction();
    return true;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const getCart = async (userId) => {
  try {
    return await dataSource.query(
      `
      SELECT
        u.id userId,
        oi.order_price orderPrice,
        oi.order_count orderCount,
        oi.food_id foodId,
        f.id,
        f.food food,
        f.eng_food engFood,
        fi.food_image,
        c.country country,
        co.eng_continent continent
      FROM users u
      JOIN orders o ON o.user_id = u.id
      JOIN order_items oi ON o.order_items_id = oi.id
      JOIN foods f ON f.id = oi.food_id
	    JOIN food_images fi ON fi.food_id = f.id
      JOIN countries c ON f.country_id = c.id
      JOIN continents co ON co.id  = c.continent_id
      WHERE o.user_id = ? AND oi.order_status_id = ${orderStatusEnum.PENDING};
      `,
      [userId]
    );
  } catch (err) {
    err = new Error("DATA_NOT_FOUND");
    err.statusCode = 400;
    throw err;
  }
};

const modifyOrderCount = async (foodId, quantity, userId) => {
  try {
    return await dataSource.query(
      `
      UPDATE order_items
      JOIN orders ON orders.order_items_id = order_items.id
      JOIN foods ON foods.id = order_items.food_id
      SET order_items.order_count = ?, order_items.order_price = foods.price * ?
      WHERE order_items.food_id = ?
      AND orders.user_id = ?
      `,
      [quantity, quantity, foodId, userId]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  }
};

const checkDeleteQuery = async (deleteOrderItem, userId) => {
  try {
    return await dataSource.query(
      `SELECT
        oi.id,
        o.user_id,
        oi.order_price,
        oi.order_count
      FROM order_items oi
      INNER JOIN orders o ON o.order_items_id = oi.id
      WHERE o.user_id = ? AND oi.food_id IN (?)
      `,
      [userId, deleteOrderItem]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  }
};

const deleteOrderItems = async (deleteOrderItem, userId) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();

  try {
    await queryRunner.query(
      `
      DELETE FROM orders
      WHERE order_items_id IN (
        SELECT id FROM order_items WHERE food_id IN (${deleteOrderItem})
      ) AND user_id = ?
      `,
      [userId]
    );

    await queryRunner.query(
      `
      DELETE FROM order_items
      WHERE food_id IN (${deleteOrderItem})
      `,
      [userId]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    error = new Error("ERROR IN TRANSACTION.... ROLLING BACK");
    error.statusCode = 400;
    throw error;
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  foodExists,
  addCart,
  updateFoodCount,
  getCart,
  modifyOrderCount,
  checkDeleteQuery,
  deleteOrderItems,
};
