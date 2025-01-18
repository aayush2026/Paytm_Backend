const mongoose = require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)

const userSchema= new mongoose.Schema({
  username:{
    type:String,
    require:true,
    unique:true,
    trim:true,
    lowercase:true,
    minLength:3,
    maxLength:30
  },
  firstname:{
    type:String,
    require:true,
    trim:true,
    maxLength:50
  },
  lastname:{
    type:String,
    require:true,
    trim:true,
    maxength:50
  },
  password:{
    type:String,
    require:true,
    minLength:6
  }
})

const accountSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User',
      required: true
  },
  balance: {
      type: Number,
      required: true
  }
});

const User = mongoose.model("User", userSchema)
const Account = mongoose.model('Account', accountSchema);

module.exports={
  User,
  Account
}