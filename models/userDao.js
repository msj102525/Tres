const dataSource = require("./dataSource");

const getUserByEmail = async (email) => {
  try {
    return await dataSource.query(
      `
      SELECT
      id,
      email,
      password
      FROM users
      WHERE email = ?;
    `,
      [email]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  }
};

const getCountriesList = async (req, res) => {
  try {
    return await dataSource.query(`
    SELECT 
    id,
    country
    FROM
    countries
    ORDER BY country;
  `);
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  }
};

const signUp = async (
  email,
  firstName,
  lastName,
  password,
  countries = [],
  phoneNumber,
  gender,
  birth,
  address
) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const addressResult = await queryRunner.query(
      `
        INSERT INTO addresses (
            address
        ) VALUES (?);
    `,
      [address]
    );

    const userResult = await queryRunner.query(
      `
      INSERT INTO users (
        email,
        first_name,
        last_name,
        password,
        address_id,
        phone_number,
        gender,
        birth_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        email,
        firstName,
        lastName,
        password,
        addressResult.insertId,
        phoneNumber,
        gender,
        birth,
      ]
    );

    if (countries.length > 0) {
      const countryIds = await Promise.all(
        countries.map(async (country) => {
          const result = await queryRunner.query(
            `
            SELECT id
            FROM countries
            WHERE country = ?
          `,
            [country]
          );
          return result[0]?.id;
        })
      );

      const values = countryIds.map((countryId) => [
        countryId,
        userResult.insertId,
      ]);

      await queryRunner.query(
        `
        INSERT INTO country_user (
          country_id,
          user_id
        ) VALUES ?;
        `, [values]
      );
    }
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

const getUserById = async (userId) => {
  try {
    return await dataSource.query(
      `
      SELECT
        id,
        email,
        first_name,
        last_name,
        address_id,
        phone_number,
        points
      FROM users
      WHERE id = ?;
      `, [userId]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  };
};

module.exports = {
  getCountriesList,
  signUp,
  getUserByEmail,
  getUserById,
};
