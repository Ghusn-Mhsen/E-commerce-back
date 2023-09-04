const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const CounterSchema = mongoose.Schema({
  sequenceName: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  },
});

CounterSchema.methods.getNextSequenceValue = async function () {
  const sequenceDocument = await this.model("Counters").findOneAndUpdate({
    sequenceName: this.sequenceName,
  }, {
    $inc: {
      seq: 1
    }
  }, {
    new: true,
    upsert: true
  });
  return sequenceDocument.seq;
};
CounterSchema.plugin(timestampPlugin);
module.exports = mongoose.model("Counters", CounterSchema);