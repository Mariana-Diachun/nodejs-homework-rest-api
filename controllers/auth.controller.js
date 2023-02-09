const { createUser, findUser } = require("../services/userService");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const { sendMail } = require("../helpers/index");
const HttpError = require("../helpers/HttpError");

async function register(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const verifyToken = v4();

    const avatarURL = gravatar.url(email);

    const newUser = await createUser({
      email,
      password: hashedPassword,
      avatarURL,
      verifyToken,
      verified: false,
    });

    await sendMail({
      to: email,
      subject: "Please confirm your email",
      html: `<a href="localhost:3000/api/users/verify/${verifyToken}">Confirm your email</a>`,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(409, "Email in use");
    }
    throw error;
  }
}

async function login(req, res, next) {
  const { password, email } = req.body;

  const storedUser = await findUser({
    email,
  });

  if (!storedUser) {
    throw new HttpError(401, "email is not valid");
  }

  if (!storedUser.verified) {
    throw new HttpError(
      401,
      "email is not verified. Please check your mail box"
    );
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = { id: storedUser._id };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "5h",
  });

  // const updatedUser = await findAndUpdate(
  //   storedUser._id,
  //   { token: token },
  //   { new: true }
  // );
  return res.json({
    token,
    user: {
      email,
    },
  });
}

module.exports = {
  register,
  login,
};
