const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true, 
    validate: {
        validator: function(v) {
            
            return /^[\w-\.]+@(gmail\.com|googlemail\.com)$/.test(v);
        },
        message: props => `${props.value} is not a valid Google email address!`
    }

  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters long'], // 'minlength' for password strength
    validate: {
      validator: function(value) {
        
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value) && // Special character
               /\d/.test(value); // Number
      },
      message: 'Password must contain at least one special character and one number.',
    },
  },
  role:{
    type:String,
    enum:['admin','user'],
    default: 'user'
  }
});

// Hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', UserSchema);