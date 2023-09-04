const TopicRepository = require("../../repositories/Topic/Topic");


class TopicController {
  async addTopic(req, res) {
    try {

      const {topic} = req.body;
   
      const _topic = await TopicRepository.create(topic);

      return res.json({
        message: "Add Topic Successfully",
        status: true,
        data: _topic,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getTopicByID(req, res) {
    try {
      const id = req.params.id;

      let topic = await TopicRepository.getTopicByID(id);

      return res.json({
        message: "get Topic Successfully",
        status: true,
        data: topic,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
 

  async deleteTopic(req, res) {
    try {
      const id = req.params.id;

      const topic = await TopicRepository.deleteTopicByID(id);

      

      return res.json({
        message: "Delete Topic Successfully",
        status: true,
        data: topic,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  
  async getAllTopics(req, res) {
    try {
      let limit = 10; // Number OF Post that Return in Every Request
      let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request
 

      let topics = await TopicRepository.getAllTopics(offset);

      return res.json({
        message: "get All Topics Successfully",
        status: true,
        data: topics,
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

module.exports = new TopicController();
