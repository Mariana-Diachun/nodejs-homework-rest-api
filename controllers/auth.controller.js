async function register(req, res, next) {
  console.log("register");
  res.json({ ok: true });
}

module.exports = {
  register,
};
