
const Topic = require("../../models/Topic/Topic");

class TopicRepository {

  async create(topic) {
    return await Topic.create({topic:topic});
  }

  async getTopicByID(topicID) {

    return await Topic
      .findOne({
        _id: topicID,
      }) 
  }

  async deleteTopicByID(topicID) {
    return await Topic
      .deleteOne({
        _id: topicID,
      })
  }

  async getAllTopics(offset) {
 
    return await Topic
      .find()
      .skip(offset)
      .limit(10)
  }

}

module.exports = new TopicRepository();
