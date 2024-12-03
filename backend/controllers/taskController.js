import Tasks from '../models/taskModel.js';

export const createTask = async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;
  try {
    const task = await Tasks.create({
      title,
      description,
      assignedTo,
      dueDate,
      createdBy: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find().populate('createdBy assignedTo', 'name email');
    res.status(200).json({success:true,data:tasks});
  } catch (err) {
    res.status(500).json({success:false, message: err.message });
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { status, title, description, dueDate } = req.body;

  try {
    const task = await Tasks.findByIdAndUpdate(
      taskId,
      { status, title, description, dueDate },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({success:true,data:task});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Tasks.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
