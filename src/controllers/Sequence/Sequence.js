const sequenceRepository = require("../../repositories/Sequence/sequence");

class sequenceController {
  async addSequence(req, res) {
    try {
    const  sequence = await sequenceRepository.create();

      return res.json({
        message: "Add sequence Successfully",
        status: true,
        data: sequence,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
}
module.exports = new sequenceController();
