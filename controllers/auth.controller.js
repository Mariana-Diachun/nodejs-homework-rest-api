const userService = require("../services/userService");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const HttpError = require("../helpers/HttpError");

async function register(req, res, next) {
  const { email, password, subscription } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = await userService.createUser({
      email,
      password: hashedPassword,
      subscription,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    next(new HttpError(409, "Email in use"));
  }
}

async function login(req, res, next) {
  const { password, email } = req.body;
  const storedUser = await userService.findUser({
    email,
  });

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid || !storedUser) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
  console.log(token);
  res.json({
    data: {
      token,
    },
  });
}

module.exports = {
  register,
  login,
};
