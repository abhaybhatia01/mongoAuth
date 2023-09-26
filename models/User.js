// Import necessary libraries
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')


// User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required:true,
    },
    password: {
      type: String,
      required:true,
    },
    name: String,
}, 
{ timestamps: true });

userSchema.statics.findAndValidate = async function (email,password){
  const foundUser = await this.findOne({email})
  const isValid = await bcrypt.compare(password,foundUser.password);
  return isValid? foundUser: false;
}
userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,12)

  next();
})

// User model
module.exports = mongoose.model("User", userSchema);
