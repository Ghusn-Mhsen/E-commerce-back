
const DeviceToken = require("../../models/DeviceToken/DeviceToken");

class DeviceTokenRepository {

  async create(tokenObj) {
    return await DeviceToken.create(tokenObj);
  }
  async getDeviceTokenByID(DeviceTokenId) {

    return await DeviceToken
      .findOne({
        _id: DeviceTokenId,
      })
  }
  async getDeviceTokenByUserID(UserId) {

    return await DeviceToken
      .findOne({
        UserId: UserId,
      })
  }
  async deleteDeviceTokenByID(DeviceTokenId) {
    return await DeviceToken
      .deleteOne({
        _id: DeviceTokenId,
      })
  }
  async deleteDeviceTokenByUserID(UserId) {
    return await DeviceToken
      .deleteOne({
        UserId: UserId,
      })
  }
  async getAllDeviceTokens(offset) {
 
    return await DeviceToken
      .find()
      .skip(offset)
      .limit(10)
  }

}

module.exports = new DeviceTokenRepository();
