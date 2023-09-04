const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const TopicSchema = mongoose.Schema({
   
    topic: {
        type: String,
        required: true,
    },
});

TopicSchema.plugin(timestampPlugin);
module.exports = mongoose.model("Topic", TopicSchema);