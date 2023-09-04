const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let validator = require('validator')
let timestampPlugin = require('../../utils/plugins/timestamp')
const UserSchema = mongoose.Schema({
      fullName: {
        type: String,
      
      },
      password: {
        type: String,
       
        select: false,
        validate: (value) => {
          return validator.isStrongPassword(value)
        }
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
          console.log(value)
          return validator.isEmail(value)
        }
      },
      marketName:{
        type: String,
      },
      marketLogo:{
        type: String,
      },
      phone:{
        type: String,
      },
      kycDoucoments:{
        businesslicense:{
          type: String,
        },
   
      nameOFBank: {
        type: String,
        
     
       },
      nameOfBrand: {
      type: String,
      
   
       },
      iban:{
        type:String
       },
       addressOfBank:String
      },
      role:{
        type:Number
      },
      
      address: {
        type: String,
      
      },
      
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    
    next();
});

UserSchema.plugin(timestampPlugin)
module.exports = mongoose.model('User', UserSchema);
