
const mongoose = require('mongoose');
const blackListSchema = new mongoose.Schema({

      token:String,
     
     
    
    
});
module.exports = mongoose.model('BlackList', blackListSchema);