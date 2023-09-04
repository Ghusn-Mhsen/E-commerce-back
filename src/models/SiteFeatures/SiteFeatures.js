const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const FeaturesSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
       
    },
  
    
    language: {
        type: String,
        required: true,
        enum: ["en", "ar"],
        default: "ar",
    },
   
});

FeaturesSchema.plugin(timestampPlugin);
module.exports = mongoose.model("Feature", FeaturesSchema);