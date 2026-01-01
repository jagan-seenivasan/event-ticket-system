module.exports = function requireAdmin(req, res, next) {
  // auth middleware must run before this
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};
