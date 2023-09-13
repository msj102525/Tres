const emailValidationCheck = async (email) => {
  const emailValidation = new RegExp("^[a-z]{2,}@[a-z]{2,}.[a-z]{2,}$");

  if (!emailValidation.test(email)) {
    const error = new Error("EMAIL_IS_NOT_VALID");
    error.statusCode = 409;
    throw error;
  };
  return emailValidation;
};

const passwordValidationCheck = async (password) => {
  const pwValidation = new RegExp(
    "^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})"
  );

  if (!pwValidation.test(password)) {
    const error = new Error("PASSWORD_IS_NOT_VALID");
    error.statusCode = 409;
    throw error;
  };
  return pwValidation;
};

module.exports = {
  passwordValidationCheck,
  emailValidationCheck,
};
