// import {Users} from '../models'
import jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt'
import Users from '../models/userModel.js';
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await Users.create({ name, email, password, role });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email }).populate('role');
    if (!user) return res.status(404).send({ success: false, message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ success: false, message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).send({ success: true, token });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().populate('role');
    res.status(201).send({ success: true, data: users });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};
export {
  registerUser,
  loginUser,
  getAllUsers
}