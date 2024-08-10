const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

// The userSchema includes a pre-save middleware 
// that hashes the password before saving a new user.
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
      console.log('Encrypted password:', this.password);
    }
    next();
  });


// Method to validate password
userSchema.methods.validatePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

mongoose.model('User', userSchema)