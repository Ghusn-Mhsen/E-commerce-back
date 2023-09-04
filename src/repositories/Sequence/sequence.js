
const Sequence = require("../../models/Sequence/Sequence");

class sequenceRepository {
  async create() {
    return await Sequence.create({
        sequenceName:"disputeID"
    });
  }

 

}

module.exports =new sequenceRepository();
