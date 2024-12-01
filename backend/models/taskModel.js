import mongoose from 'mongoose'

// Define the task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,   
      maxlength: 100,  
      trim: true,      
    },
    description: {
      type: String,
      maxlength: 500,  
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // Ensure that the dueDate is not in the past
          return value ? value >= Date.now() : true;
        },
        message: 'Due date cannot be in the past.',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation: Ensure that assignedTo is not the same as createdBy
taskSchema.path('assignedTo').validate(function (assignedTo) {
  return assignedTo.toString() !== this.createdBy.toString();
}, 'Assigned user cannot be the creator of the task.');

// Static method to check if a task title already exists (for unique task names)
taskSchema.statics.isTitleTaken = async function (title) {
  const task = await this.findOne({ title });
  return task ? true : false;
};

export default mongoose.model('Task', taskSchema);
