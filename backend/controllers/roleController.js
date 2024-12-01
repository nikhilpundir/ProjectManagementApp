import roleModel from "../models/roleModel";

exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;
  try {
    const role = await Role.create({ name, permissions });
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
