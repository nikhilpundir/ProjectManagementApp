import Project from '../models/projectModel.js';

export const createProject = async (req, res) => {
  const { name, description, team, startDate, endDate } = req.body;
  try {
    const project = await Project.create({ name, description, team, startDate, endDate });
    res.status(201).send({success:true,data:project});
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const project = await Project.find().populate("team",'name email');
    res.status(201).send({ success: true, data: project });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};