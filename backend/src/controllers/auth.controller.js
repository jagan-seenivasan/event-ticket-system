const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/mysql");

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

exports.register = async (req, res) => {

  try{
const { name, email, password } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: "USER" });

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  }catch(err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try{
const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  return res.json({ token });
  }catch(err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
  
};
