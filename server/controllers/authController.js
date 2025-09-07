import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
  try {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role });
    res.json({ msg: "User registered", user });
  } catch(err){
    res.status(400).json({ err: err.message });
  }
};

export const login = async (req,res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username }});
    if(!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign({ id: user.id,name: user.username, role: user.role }, "secret_key", { expiresIn: "1d" });
    res.json({ token, role: user.role });
  } catch(err){
    res.status(500).json({ err: err.message });
  }
};
