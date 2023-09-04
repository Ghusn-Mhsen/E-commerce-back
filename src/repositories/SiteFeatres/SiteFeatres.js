
const features = require("../../models/SiteFeatures/SiteFeatures");

class FeaturesRepository {

  async create(featureObj) {
    return await features.create(featureObj);
  }

  async getFeaturesByID(featureId) {

    return await features
      .findOne({
        _id: featureId,
      })
  }

 
  
 

  async deleteFeaturesByID(featureId) {
    return await features
      .deleteOne({
        _id: featureId,
      })
  }

 

  async getAllFeatures(offset,language) {
 
    return await features
      .find({language:language})
      .skip(offset)
      .limit(10)
  }

}

module.exports = new FeaturesRepository();
