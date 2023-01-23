const userService = require("../services/userService");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const HttpError = require("../helpers/HttpError");

async function register(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = await userService.createUser({
      email,
      password: hashedPassword,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    next(new HttpError(409, "Email in use"));
  }
}

async function login(req, res, next) {
  const { password, email } = req.body;

  const isUserValid = await userService.findUser({
    email,
  });

  if (!isUserValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, isUserValid.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = { id: isUserValid._id };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  const updatedUser = await userService.findAndUpdate(
    isUserValid._id,
    { token: token },
    { new: true }
  );

  res.json({
    token: updatedUser.token,
    user: {
      email: isUserValid.email,
      subscription: isUserValid.subscription,
    },
  });
}

module.exports = {
  register,
  login,
};
