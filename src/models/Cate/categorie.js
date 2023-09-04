const mongoose = require('mongoose');


let timestampPlugin = require('../../utils/plugins/timestamp')
const CategorieScehma = mongoose.Schema({
   
      
       ImageOfCate:String,
       arName:{
       type: String,
    
    },
       enName:String,
       MerchantId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       },
       HomePage:{
        type:Boolean,
        default:false
       }
      
     
    
});


CategorieScehma.plugin(timestampPlugin)
module.exports = mongoose.model('Categorie', CategorieScehma);
