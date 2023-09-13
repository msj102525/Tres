const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const authorization = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return res.status(400).json({ message: "EMPTY TOKEN" });

    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const [user] = await userService.getUserById(decoded.id);

    if (!user) {
      const error = new Error("USER_DOES_NOT_EXIST");
      error.statusCode = 404;
      return res.status(error.statusCode).json({ message: error.message });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "AUTHORIZATION ERROR" });
  }
};
module.exports = { authorization };
