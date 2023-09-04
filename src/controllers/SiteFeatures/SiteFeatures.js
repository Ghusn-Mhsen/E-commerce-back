const FeaturesRepository = require("../../repositories/SiteFeatres/SiteFeatres");
const deleteFile = require("../..//utils/deleteFile");
const { FeaturesPATH } = require("../../config/path");
class FeaturesController {
  async addFeature(req, res) {
    try {
      var { icon } = req.files;
      var feature;
      var featureObj = {};

      featureObj = req.body;
      featureObj.icon = "Features\\"+icon[0].filename;
      feature = await FeaturesRepository.create(featureObj);

      return res.json({
        message: "Add Features Successfully",
        status: true,
        data: feature,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getFeature(req, res) {
    try {
      const id = req.params.id;

      let feature = await FeaturesRepository.getFeaturesByID(id);

      return res.json({
        message: "get Feature Successfully",
        status: true,
        data: feature,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }

  async deleteFeature(req, res) {
    try {
      const id = req.params.id;

      const file = await FeaturesRepository.getFeaturesByID(id);

      let feature = await FeaturesRepository.deleteFeaturesByID(id);
      deleteFile({ path: FeaturesPATH + file.icon });

      return res.json({
        message: "Delete feature Successfully",
        status: true,
        data: feature,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getAllFeatures(req, res) {
    try {
      let limit = 10; // Number OF Post that Return in Every Request
      let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request
      const language = req.query.language ? req.query.language : "ar";

      let features = await FeaturesRepository.getAllFeatures(offset, language);

      return res.json({
        message: "get All features Successfully",
        status: true,
        data: features,
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

module.exports = new FeaturesController();
