const mongoose = require("mongoose");
const sequence = require("../Sequence/Sequence");

let validator = require("validator");

let timestampPlugin = require("../../utils/plugins/timestamp");
const DisputeSchema = mongoose.Schema({
    disputeID: {
        type: Number,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    phone: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isMobilePhone(value);
        },
    },
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    message: {
        type: String,
        required: true,
    },
    disputeImage: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "underProcess", "resolve"],
        default: "pending",
    },
    type_User: {
        type: String,
        required: true,
        enum: ["customer", "guest"],
        default: "customer",
    },
    type_Dispute: {
        type: String,
        required: true,
        enum: ["global", "order"],
        default: "global",
    },
    notes:[
        {
          owner_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          message:{
            type:String,
            required:true
        },
          createdAt: {
            type:Date,
            default:Date.now,
          },
          _id: false,
        }
      ],
});
DisputeSchema.pre("save", async function (next) {
   
    const doc = this;
  
    if (!doc.disputeID) {
       const sequenceDocument = await sequence.findOne({
            sequenceName: "disputeID",
        });
      
       
        doc.disputeID = await sequenceDocument.getNextSequenceValue();
    }

    next();
});
DisputeSchema.plugin(timestampPlugin);
module.exports = mongoose.model("dispute", DisputeSchema);