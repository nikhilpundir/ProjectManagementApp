import Roles from "../models/roleModel.js";

export const createRole = async (req, res) => {
  const { name, permissions } = req.body;
  try {
    const role = await Roles.create({ name, permissions });
    res.status(201).json({success:true,data:role});
  } catch (err) {
    res.status(400).json({success:false, message: err.message });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Roles.find();
    res.status(201).send({ success: true, data: roles });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};
