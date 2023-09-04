const mongoose = require('mongoose');


let timestampPlugin = require('../../utils/plugins/timestamp')
const BannerScehma = mongoose.Schema({
   
      
       content:{
        type: String,
      
       },
       endDate:Date
     
      
      
      
     
    
});


BannerScehma.plugin(timestampPlugin)
module.exports = mongoose.model('Banner', BannerScehma);
