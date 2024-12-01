import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    name: {
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
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'completed', 'on hold', 'canceled'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.path('team').validate((team) => team.length > 0, 'A project must have at least one team member');

projectSchema.statics.isProjectNameTaken = async function (name) {
  const project = await this.findOne({ name });
  return project ? true : false;
};

export default mongoose.model('Project', projectSchema);
