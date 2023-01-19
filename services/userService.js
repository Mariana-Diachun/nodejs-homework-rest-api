const { User } = require("../models/user");

async function createUser(userData) {
  const { email, password, subscription } = userData;
  return await User.create({ email, password, subscription });
}

async function findUser(email) {
  return await User.findOne(email);
}
module.exports = { createUser, findUser };
