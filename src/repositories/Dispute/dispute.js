
const dispute = require("../../models/Dispute/Dispute");

class disputeRepository {
  async create(disputeObj) {
    return await dispute.create(disputeObj);
  }

  async getDisputeByID(disputeId) {
  
    return await dispute
      .findOne({
        _id: disputeId,
      })
      .populate("merchant_id")
      .populate("order_id");
  }
  async getDisputesByEmail(email) {
   
    return await dispute
      .find({
        email: email,
      })
      .populate("merchant_id")
      .populate("order_id");
  }

  async getDisputeEmail(id) {
    

    return await dispute
      .findOne({
        _id: id,
      }).select({ "email":1})
  }
  
 

  async deleteDisputeByID(disputeId) {
    return await dispute
      .deleteOne({
        _id: disputeId,
      })
      .populate("merchant_id")
      .populate("order_id");
  }

  async searchForDispute(message, merchant_id = null) {
    const query = { message: { $regex: message, $options: "i" } };
    if (merchant_id) {
      query.merchant_id = merchant_id;
    }
  
    return await dispute
      .find(query)
      .populate("merchant_id")
      .populate("order_id");
  }

  async getAllDispute(offset, merchant_id = null) {
    const query = {};
    if (merchant_id) {
      query.merchant_id = merchant_id;
    }
  
    return await dispute
      .find(query)
      .skip(offset)
      .limit(10)
      .populate("merchant_id")
      .populate("order_id");
  }

  async processDispute(id) {
    await dispute.updateMany(
      {
        _id: id,
      },
      {
        $set: {
          status: "underProcess",
        },
      }
    );

    return await this.getDisputeByID(id);
  }
  
  async resolveDispute(id) {
    await dispute.updateMany(
      {
        _id: id,
      },
      {
        $set: {
          status: "resolve",
        },
      }
    );

    return await this.getDisputeByID(id);
  }

  async advancedSearch(query_1, query_2, query_3, offset) {
    const stages = [];
    // ** pagination object **
    // ***************************************************************
    const skip = {
      $skip: offset,
    };
    const limit = {
      $limit: 10,
    };
    // ****************************************************************

    // ** dispute object **
    // ****************************************************************
    const match_dispute = {
      $match: query_1,
    };

    // ****************************************************************

    // ** merchant object **
    // ****************************************************************
    const lookup_merchant = {
      $lookup: {
        from: "users",
        localField: "merchant_id",
        foreignField: "_id",
        as: "merchant",
      },
    };

    const match_merchant = {
      $match: {
        "merchant.name": query_2,
      },
    };
    const unwind_merchant = {
      $unwind: "$merchant",
    };

    // ****************************************************************

    // ** order object
    // ****************************************************************

    const lookup_order = {
      $lookup: {
        from: "orders",
        localField: "order_id",
        foreignField: "_id",
        as: "order",
      },
    };

    const unwind_order = { $unwind: "$order" };

    const unwind_products = { $unwind: "$order.products" };

    const lookup_product = {
      $lookup: {
        from: "products",
        localField: "order.products",
        foreignField: "_id",
        as: "product",
      },
    };
    const unwind_product = { $unwind: "$product" };

    const match_product = {
      $match: {
        "product.name": query_3,
      },
    };
    // ****************************************************************

    stages.push(match_dispute);

    if (query_2 != null) {
      stages.push(lookup_merchant);
      stages.push(unwind_merchant);
      stages.push(match_merchant);
    }

    if (query_3 != null) {
      stages.push(lookup_order);
      stages.push(unwind_order);
      stages.push(unwind_products);
      stages.push(lookup_product);
      stages.push(unwind_product);
      stages.push(match_product);
    }
    stages.push(skip);
    stages.push(limit);

    return await dispute.aggregate(stages);
  }

  async addComment(comment, dispute_Id) {
    const disputeUser = dispute.findOne({ _id: dispute_Id });

    if (!disputeUser) return null;

    return await dispute.updateOne(
      {
        _id: dispute_Id,
      },
      {
        $push: {
          notes: comment,
        },
      }
    );
  }

}

module.exports = new disputeRepository();
