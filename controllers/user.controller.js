// const { User } = require("../models/user");

async function createMovie(req, res, next) {
  const { user } = req;
  const { id: contactId } = req.body;
  user.contacts.push({ id: contactId });
}

async function getMovies(req, res, next) {}

async function me(req, res, next) {}

module.exports = {
  createMovie,
  getMovies,
  me,
};
