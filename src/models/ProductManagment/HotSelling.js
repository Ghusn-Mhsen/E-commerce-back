const mongoose = require('mongoose');


let timestampPlugin = require('../../utils/plugins/timestamp')
const HotSellsScehma = mongoose.Schema({
   
      
       product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
       },
       influncer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       },
       HomeTrend:{
        type:Boolean,
        default:false
       },
       endDate:Date,
       ToHomeTrend:Boolean
      
      
     
    
});


HotSellsScehma.plugin(timestampPlugin)
module.exports = mongoose.model('HotSells', HotSellsScehma);
