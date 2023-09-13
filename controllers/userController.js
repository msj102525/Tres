const userService = require("../services/userService");
const { catchAsync } = require("../utils/error");
const {
  emailValidationCheck,
  passwordValidationCheck,
} = require("../utils/validationCheck");

const userEmailCheck = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    const error = new Error("EMAIL_EMPTY!");
    error.statusCode = 400;
    throw error;
  }

  await emailValidationCheck(email);

  const result = await userService.userEmailCheck(email);

  if (!result) return res.status(200).json({ isEmailExist: false });

  return res.status(200).json({ isEmailExist: true });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;
    throw error;
  }

  const result = await userService.login(email, password);

  return res.status(200).send({ accessToken: result });
});

const getCountriesList = catchAsync(async (req, res) => {
  const result = await userService.getCountriesList();

  return res.status(200).json(result);
});

const signUp = catchAsync(async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    password,
    countries,
    phoneNumber,
    gender,
    birth,
    address,
  } = req.body;

  if (
    !email ||
    !firstName ||
    !lastName ||
    !password ||
    !phoneNumber ||
    !gender ||
    !birth ||
    !address
  ) {
    const error = new Error("VALUE_MUST_NOT_EMPTY");
    error.statusCode = 400;
    throw error;
  }

  await passwordValidationCheck(password);

  await userService.signUp(
    email,
    firstName,
    lastName,
    password,
    countries,
    phoneNumber,
    gender,
    birth,
    address
  );

  return res.status(200).json({ message: "SIGN_UP_SUCCESS" });
});

module.exports = {
  userEmailCheck,
  login,
  getCountriesList,
  signUp,
};
