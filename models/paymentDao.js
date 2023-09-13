const dataSource = require("./dataSource");

const getUserInfo = async (userId) => {
  try {
    return await dataSource.query(
      `
      SELECT
        u.id userId,
        u.email,
        u.last_name lastName,
        u.first_name firstName,
        u.phone_number phoneNumber,
        u.points,
        a.address
      FROM addresses a
      JOIN users u ON a.id = u.address_id
      WHERE u.id = ?;
      `,
      [userId]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    return error;
  }
};

const getCartFoodInfo = async (userId, foodIds) => {
  try {
    return await dataSource.query(
      `
      SELECT
        f.id,
        f.food foodKrName,
        f.eng_food foodEngName,
        c.country country,
        oi.order_price orderPrice,
        oi.order_count quantity,
        fi.food_image foodImage,
        co.eng_continent continent
      FROM users u
      JOIN orders o ON u.id = o.user_id
      JOIN order_items oi ON oi.id = o.order_items_id
      JOIN foods f ON f.id = oi.food_id
      JOIN countries c ON c.id = f.country_id
      JOIN food_images fi ON fi.food_id = f.id
	    JOIN continents co ON co.id = c.continent_id
      WHERE u.id = ? AND oi.order_status_id = 1 AND oi.food_id IN (?);
    `,
      [userId, foodIds]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    return error;
  }
};

const checkAddress = async (userId) => {
  try {
    const address = await dataSource.query(
      `
      SELECT
        u.id,
        a.id,
        a.address
      FROM users u
      JOIN addresses a ON u.address_id = a.id
      WHERE u.id = ?
      `,
      [userId]
    );
    return address[0].address;
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    return error;
  }
};

const updateAddress = async (userId, address) => {
  try {
    await dataSource.query(
      `
      UPDATE addresses a
      JOIN users u ON u.address_id = a.id
      SET a.address = ?
      WHERE u.id = ?
      `,
      [address, userId]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    return error;
  }
};

const checkPoint = async (userId) => {
  try {
    const result = await dataSource.query(
      `
      SELECT
        u.id,
        u.points
      FROM users u
      WHERE u.id = ?
    `,
      [userId]
    );
    return result[0].points;
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    return error;
  }
};

const payment = async (userId, point) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();

  try {
    const orderNumber = Date.now().toString();

    await queryRunner.query(
      `
      UPDATE
        users u
      SET points = u.points - ?
      WHERE id = ?
      `,
      [point, userId]
    );

    await queryRunner.query(
      `
      UPDATE
        orders o
      JOIN order_items oi ON o.order_items_id = oi.id
      SET oi.order_status_id = 2, o.order_number = ?
      WHERE o.user_id = ? AND oi.order_status_id = 1;
        `,
      [orderNumber, userId]
    );

    const userFinalPoint = await queryRunner.query(
      `
      SELECT
      u.points
      FROM users u
      WHERE u.id = ?
    `,
      [userId]
    );

    await queryRunner.commitTransaction();
    return userFinalPoint;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    error = new Error("DATA_NOT_FOUND");
    error.statusCode = 400;
    throw error;
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  checkAddress,
  updateAddress,
  getUserInfo,
  getCartFoodInfo,
  checkPoint,
  payment,
};
