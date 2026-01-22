module.exports = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized Action: Please Sign-in." });
  }
  next();
};  