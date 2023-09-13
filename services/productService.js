const productDao = require("../models/productDao");

const getRandomProducts = async (offset, limit) => {
  return await productDao.getRandomProducts(offset, limit);
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
  const getAllProducts = await productDao.getAllProducts(
    orderBy,
    countryId,
    spiceLevel,
    allergyId,
    meatId,
    vegetarian,
    limit,
    offset
  );

  const [getCountries] = await productDao.getCountries(countryId);
  getCountries["foods"] = getAllProducts;

  return getCountries;
};

const getProductInfo = async (foodId) => {
  const [getProductInfo] = await productDao.getProductInfo(foodId);

  return getProductInfo;
};

const getCategories = async() => {
  const result = await productDao.getCategories();

  const categoryList = result.map(category => category.categories);
  
  return categoryList
}

module.exports = {
  getRandomProducts,
  getProductInfo,
  getAllProducts,
  getCategories
};
