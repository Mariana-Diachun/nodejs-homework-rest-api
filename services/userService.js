const { User } = require("../models/user");

async function createUser(userData) {
  const { email, password, subscription, avatarURL, verifyToken, verified } =
    userData;
  return await User.create({
    email,
    password,
    subscription,
    avatarURL,
    verifyToken,
    verified,
  });
}

async function findUser({ email }) {
  return await User.findOne({ email });
}

async function findAndUpdate(userId, userData) {
  return await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });
}

module.exports = { createUser, findUser, findAndUpdate };
