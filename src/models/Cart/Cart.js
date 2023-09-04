const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const CartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product.Class",
      },
      group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product.Class.group",
      },
      quantity:{
        type:Number,
        default:1
      }
    }
      
  ],
  totalCost: {
    type: Number,
   default:0,
  },
});

CartSchema.plugin(timestampPlugin);
module.exports = mongoose.model("Cart", CartSchema);
