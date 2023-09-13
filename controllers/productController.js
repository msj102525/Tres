const productService = require("../services/productService");
const { catchAsync } = require("../utils/error");

const getRandomProducts = catchAsync(async (req, res) => {
  const { from, count } = req.query;

  if (!from || !count) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;
    throw error;
  }

  const DEFAULT_OFFSET = 1;
  const DEFAULT_LIMIT = 10;
  
  const offset = from ? from : DEFAULT_OFFSET;
  const limit = count ? count : DEFAULT_LIMIT;

  const mainPage = await productService.getRandomProducts(offset, limit);

  return res.status(200).json({ mainPage });
});

const getAllProducts = catchAsync(async (req, res) => {
  const {
    orderBy,
    countryId,
    spiceLevel,
    allergyId,
    meatId,
    vegetarian,
    limit,
    offset,
  } = req.query;

  if (!countryId) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;
    throw error;
  }

  const result = await productService.getAllProducts(
    orderBy,
    countryId,
    spiceLevel,
    allergyId,
    meatId,
    vegetarian,
    limit,
    offset
  );
  return res.status(200).json(result);
});

const getProductInfo = catchAsync(async (req, res) => {
  const { foodId } = req.params;

  if (!foodId) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;
    throw error;
  }

  const result = await productService.getProductInfo(foodId);

  return res.status(200).json(result);
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await productService.getCategories();

  return res.status(200).json(categories);
});

module.exports = {
  getRandomProducts,
  getAllProducts,
  getProductInfo,
  getCategories,
};
