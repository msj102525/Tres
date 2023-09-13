const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  passwordValidationCheck,
  emailValidationCheck,
} = require("../utils/validationCheck");

const userDao = require("../models/userDao");

const userEmailCheck = async (email) => {
  const [user] = await userDao.getUserByEmail(email);
  return user;
};

const login = async (email, password) => {
  const [user] = await userDao.getUserByEmail(email);

  const passwordResult = await bcrypt.compare(password, user.password);

  if (!user || !passwordResult) {
    const error = new Error("INVALID_PASSWORD");
    error.statusCode = 409;
    throw error;
  }

  return jwt.sign(
    {
      id: user.id,
    },
    process.env.SECRETKEY,
    {
      expiresIn: process.env.expiresIn,
      issuer: process.env.issuer,
    }
  );
};

const getCountriesList = async (req, res) => {
  return await userDao.getCountriesList();
};

const signUp = async (
  email,
  firstName,
  lastName,
  password,
  cointries,
  phoneNumber,
  gender,
  birth,
  address
) => {
  await emailValidationCheck(email);
  await passwordValidationCheck(password);
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALTROUND)
  );

  const signUp = await userDao.signUp(
    email,
    firstName,
    lastName,
    hashedPassword,
    cointries,
    phoneNumber,
    gender,
    birth,
    address
  );
  return signUp;
};

const getUserById = async (userId) => {
  const user = await userDao.getUserById(userId);

  if (!user) {
    const error = new Error("INVALID_USER");
    error.statusCode = 400;
    throw error;
  }
  return user;
};

module.exports = {
  userEmailCheck,
  login,
  getCountriesList,
  signUp,
  getUserById,
};
