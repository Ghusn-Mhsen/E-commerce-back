const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const DeviceTokenSchema = mongoose.Schema({
   
    token: {
        type: String,
        required: true,
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
   
  
    
   
   
});

DeviceTokenSchema.plugin(timestampPlugin);
module.exports = mongoose.model("DeviceToken", DeviceTokenSchema);