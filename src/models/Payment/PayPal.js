const mongoose = require("mongoose");

let timestampPlugin = require("../../utils/plugins/timestamp");
const PayPalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
  paypal_payment_id: {
    type: String,
  },
  payment_method: {
    type: String,
    default: "paypal",
  },
  payer: {
    email: String,
    first_name: String,
    last_name: String,
    payer_id: String,
  },

  transactions: [
    {
      amount: {
        total: String,
        currency: String,
      },
      payee: {
        merchant_id: String,
        email: String,
      },
      description: String,
      transaction_fee: {
        value: String,
        currency: String,
      },
      create_time: Date,
    },
  ],
});

PayPalSchema.plugin(timestampPlugin);
module.exports = mongoose.model("payPal", PayPalSchema);
