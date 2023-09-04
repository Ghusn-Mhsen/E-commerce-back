const DeviceTokenRepository = require("../../repositories/DeviceToken/DeviceToken");


class DeviceTokenController {
  async addDeviceToken(req, res) {
    try {

      const DeviceTokenObj = req.body;
      const deviceToken = await DeviceTokenRepository.create(DeviceTokenObj);

      return res.json({
        message: "Add DeviceToken Successfully",
        status: true,
        data: deviceToken,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getDeviceTokenByID(req, res) {
    try {
      const id = req.params.id;

      let deviceToken = await DeviceTokenRepository.getDeviceTokenByID(id);

      return res.json({
        message: "get DeviceToken Successfully",
        status: true,
        data: deviceToken,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getDeviceTokenByUserID(req, res) {
    try {
      const id = req.params.id;

      let deviceToken = await DeviceTokenRepository.getDeviceTokenByUserID(id);

      return res.json({
        message: "get DeviceToken Successfully",
        status: true,
        data: deviceToken,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }

  async deleteDeviceToken(req, res) {
    try {
      const id = req.params.id;

      const deviceToken = await DeviceTokenRepository.deleteDeviceTokenByID(id);

      

      return res.json({
        message: "Delete Device Token Successfully",
        status: true,
        data: deviceToken,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async deleteDeviceTokenByUserId(req, res) {
    try {
      const id = req.params.id;

      const deviceToken = await DeviceTokenRepository.deleteDeviceTokenByUserID(id);

      

      return res.json({
        message: "Delete Device Token Successfully",
        status: true,
        data: deviceToken,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getAllDeviceToken(req, res) {
    try {
      let limit = 10; // Number OF Post that Return in Every Request
      let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request
 

      let deviceTokens = await DeviceTokenRepository.getAllDeviceTokens(offset);

      return res.json({
        message: "get All Device Tokens Successfully",
        status: true,
        data: deviceTokens,
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

module.exports = new DeviceTokenController();
