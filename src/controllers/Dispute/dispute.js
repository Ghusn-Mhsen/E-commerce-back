const disputeRepository = require("../../repositories/Dispute/dispute");
const UserRepository = require("../../repositories/UserManagment/UserRepository");
const config = require("../../config/info");
const sendEmail = require("../../utils/send_mail");
const deleteFile = require("../..//utils/deleteFile");
const { DisputePATH } = require("../../config/path");
class DisputeController {
  async addDispute(req, res) {
    try {
      var { disputeImage } = req.files;
      var dispute;
      var disputeObj = {};

      const merchant_id = req.query.merchant_id;
      disputeObj = req.body;

      disputeImage = disputeImage ? "Dispute\\"+disputeImage[0].filename : "";

      if (disputeImage != "") disputeObj.disputeImage = disputeImage;
      if (merchant_id != null) disputeObj.merchant_id = merchant_id;
      dispute = await disputeRepository.create(disputeObj);

      return res.json({
        message: "Add Dispute Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getDispute(req, res) {
    try {
      const id = req.params.id;

      let dispute = await disputeRepository.getDisputeByID(id);

      return res.json({
        message: "get Dispute Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getDisputesByEmail(req, res) {
    try {
      const email = req.body.email;

      let dispute = await disputeRepository.getDisputesByEmail(email);

      return res.json({
        message: "get Disputes By Email Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async processDispute(req, res) {
    try {
      const id = req.params.id;

      let dispute = await disputeRepository.processDispute(id);

      return res.json({
        message: "get processDispute Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async resolveDispute(req, res) {
    try {
      const id = req.params.id;

      let dispute = await disputeRepository.resolveDispute(id);

      return res.json({
        message: "get resolve Dispute Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async searchForDispute(req, res) {
    try {
      const { message } = req.body;
      const {merchant_id} = req.query
      let dispute = await disputeRepository.searchForDispute(message,merchant_id);

      return res.json({
        message: "get Disputes Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async deleteDispute(req, res) {
    try {
      const id = req.params.id;
      const file = await disputeRepository.getDisputeByID(id);

      let dispute = await disputeRepository.deleteDisputeByID(id);
      deleteFile({ path: DisputePATH + file.disputeImage });
      return res.json({
        message: "Delete Dispute Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getAllDispute(req, res) {
    try {
      const {merchant_id} = req.query
      let limit = 10; // Number OF Post that Return in Every Request
      let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request
      let dispute = await disputeRepository.getAllDispute(offset,merchant_id);

      return res.json({
        message: "get All Dispute Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }

  async advancedSearch(req, res) {
    try {
      let limit = 10; // Number OF Post that Return in Every Request

      let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request
      var query_1 = {};
      var query_2;
      var query_3;
      var {
        disputeID,
        firstName,
        lastName,
        email,
        phone,
        message,
        status,
        type_User,
        type_Dispute,
        productName,
        merchantName,
      } = req.query;

      // ** this filter based on property in Dispute Schema
      if (disputeID) query_1.disputeID = parseInt(disputeID);
      if (firstName) query_1.firstName = { $regex: firstName, $options: "i" };
      if (lastName) query_1.lastName = { $regex: lastName, $options: "i" };
      if (email) query_1.email = email;
      if (phone) query_1.phone = phone;
      if (type_User) query_1.type_User = type_User;
      if (type_Dispute) query_1.type_Dispute = type_Dispute;
      if (status) query_1.status = status;
      if (message) query_1.message = { $regex: message, $options: "i" };

      // ** this filter based on property in Users Schema
      if (merchantName)
        query_2 = merchantName ? { $regex: merchantName, $options: "i" } : null;

      // ** this filter based on property in Products Schema
      if (productName)
        query_3 = productName ? { $regex: productName, $options: "i" } : null;

      let dispute = await disputeRepository.advancedSearch(
        query_1,
        query_2,
        query_3,
        offset
      );
      return res.json({
        message: "search Successfully",
        status: true,
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }

  async addComment(req, res) {
    try {
      const owner_id = req._id;
      const dispute_Id = req.params.id;

      const merchant_id = req.query.merchant_id;
      const { message, admin } = req.body;

      const comment = {};
      comment.owner_id = owner_id;
      comment.message = message;

      const dispute = await disputeRepository.addComment(comment, dispute_Id);
      const sequence = await disputeRepository.getDisputeByID(dispute_Id);
      const email = await getEmail(admin, merchant_id, dispute_Id);
      await sendEmail({
        email: email,
        pin: `A new comment has been added to Dispute NO.${sequence.disputeID}`,
        subject: false,
        Verification: "Dispute",
      });

      return res.json({
        message: "add  Comment To Dispute Successfully",
        status: true,
        data: dispute,
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

async function getEmail(admin, merchant_id, id) {
  if (admin) {
    // ** Send email to User
    const { email } = await disputeRepository.getDisputeEmail(id);
    return email;
  } else if (merchant_id) {
    // ** Send email to Merchant From user
    const { email } = await UserRepository.getUserByID(merchant_id);
    return email;
  } else {
    // ** Send email to Admin From user
    return config.email;
  }
}
module.exports = new DisputeController();
