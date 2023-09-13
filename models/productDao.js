const dataSource = require("./dataSource");
const builder = require("./builder");

const getRandomProducts = async (offset, limit) => {
  try {
    return await dataSource.query(
      `SELECT 
        c.country, 
        f.food, 
        f.price,
        f.id,
        GROUP_CONCAT(fi.food_image SEPARATOR ',')AS food_images
      FROM countries c
      JOIN foods f ON c.id = f.country_id
      JOIN food_images fi ON f.id = fi.food_id
      GROUP BY c.country, f.food, f.price, f.id
      ORDER BY RAND()
      LIMIT ${limit}
      OFFSET ${offset}
      `
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode(400);
    throw error;
  }
};

const getAllProducts = async (
  orderBy,
  countryId,
  spiceLevel,
  allergyId,
  meatId,
  vegetarian,
  limit,
  offset
) => {
  try {
    const baseQuery = 
      `
      SELECT DISTINCT
        f.id,
        f.food,
        f.eng_food,
        f.price,
        fi.food_image,
        ct.continent AS continent,
        c.country As country,
        (SELECT COUNT(*) FROM likes l WHERE l.food_id = f.id) likes_count
      FROM foods f
      LEFT JOIN food_images fi ON fi.food_id = f.id
      LEFT JOIN countries c ON c.id = f.country_id
      LEFT JOIN continents ct ON ct.id = c.continent_id
      LEFT JOIN meat_foods mf ON f.id = mf.food_id
      LEFT JOIN meats m ON mf.meat_id = m.id
      LEFT JOIN allergy_foods af ON f.id = af.food_id
      LEFT JOIN allergies a ON a.id = af.allergy_id
      `;

    const whereCondition = builder.filterBuilder(
      countryId,
      spiceLevel,
      allergyId,
      meatId,
      vegetarian
    );
    const sortQuery = builder.orderByBuilder(orderBy);
    const limitQuery = builder.limitBuilder(limit, offset);
    const rooms = await dataSource.query(
      `${baseQuery} ${whereCondition} ${sortQuery} ${limitQuery}`
    );
    return rooms;
  } catch (error) {
    error = new Error("FAILED_TO_BUILD_FILTER_QUERY");
    error.statusCode = 400;
    throw error;
  };
};

const getCountries = async (countryId) => {
  try {
    return await dataSource.query(
      `SELECT
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "id", c.id , 
            "country", c.country
          )
        ) countries
      FROM countries c 
      JOIN continents ct ON c.continent_id = ct.id
      WHERE c.continent_id = (SELECT ct.id
                              FROM continents ct
                              JOIN countries c ON c.continent_id = ct.id
                              WHERE c.id = ?)
      `, [countryId]
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  };
};

const getProductInfo = async (foodId) => {
  try {
    return await dataSource.query(
      `SELECT
        f.id,
        f.food,
        f.eng_food,
        f.price,
        f.vegetarian,
        ct.continent,
        ct.eng_continent,
        c.country,
        c.eng_country,
        f.spice_level,
        f.description,
        f.eng_description,
        GROUP_CONCAT(DISTINCT a.allergy SEPARATOR ',') AS allergy,
        GROUP_CONCAT(DISTINCT a.eng_allergy SEPARATOR ',') AS eng_allergy,
        GROUP_CONCAT(DISTINCT m.meat SEPARATOR ',') AS meat,
        GROUP_CONCAT(DISTINCT m.eng_meat SEPARATOR ',') AS eng_meat,
        fi.food_image,
        r.review
      FROM foods f
      LEFT JOIN food_images fi ON f.id = fi.food_id
      LEFT JOIN meat_foods mf ON f.id = mf.food_id
      LEFT JOIN meats m ON mf.meat_id = m.id
      LEFT JOIN allergy_foods af ON f.id = af.food_id
      LEFT JOIN allergies a ON a.id = af.allergy_id
      LEFT JOIN reviews r ON r.food_id = f.id
      LEFT JOIN countries c ON f.country_id = c.id
      LEFT JOIN continents ct ON ct.id = c.continent_id
      WHERE f.id = ?
      GROUP BY
        f.id,
        f.food,
        f.eng_food,
        f.price, 
        f.vegetarian,
        ct.continent,
        ct.eng_continent,
        c.country,
        c.eng_country,
        f.spice_level,
        f.description,
        f.eng_description,
        fi.food_image,
        r.review
      `, [foodId]
    );
  } catch (error) {
    error = new Error("FAILED_TO_BUILD_FILTER_QUERY");
    error.statusCode = 400;
    throw error;
  }
};

const getCategories = async () => {
  try {
    return await dataSource.query(
      `SELECT
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', c.id,
          'continent', co.id,
          'name', c.country,
          'engName', c.eng_country
        )
      ) AS categories
      FROM countries c
      JOIN continents co ON co.id = c.continent_id
      GROUP BY co.id
      `
    );
  } catch (error) {
    error = new Error("DATASOURCE ERROR");
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  getRandomProducts,
  getAllProducts,
  getCountries,
  getProductInfo,
  getCategories,
};
