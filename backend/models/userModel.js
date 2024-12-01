import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    // validate: [validator.isEmail, 'Please provide a valid email address'] 
  },
  password: { 
    type: String,
    required: true,
    minlength: 6
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isPasswordValid = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

export default mongoose.model('User', userSchema);
