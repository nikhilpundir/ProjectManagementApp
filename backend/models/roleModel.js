import mongoose from 'mongoose'

const roleActionsEnum = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,  
  },
  permissions: {
    type: [
      {
        resource: { 
          type: String, 
          required: true,
          uppercase: true,
          enum: ['PROJECT', 'USER', 'TASK'],
        },
        actions: { 
          type: [String], 
          required: true,
          enum: roleActionsEnum,
          validate: {
            validator: (v) => Array.isArray(v) && v.every(action => roleActionsEnum.includes(action)),
            message: 'Invalid actions for the resource.',
          }
        },
      },
    ],
    required: true,
    validate: {
      validator: function(permissions) {
        return permissions.length > 0;
      },
      message: 'At least one permission is required.',
    },
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
}, { 
  timestamps: true,
});

roleSchema.index({ 'permissions.resource': 1 });

const Roles = mongoose.model('Role', roleSchema);
export default Roles
