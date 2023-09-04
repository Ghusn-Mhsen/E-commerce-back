const mongoose = require("mongoose");
let validator = require("validator");
let timestampPlugin = require("../../utils/plugins/timestamp");
const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userInfo: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Invalid email address"],
      },
      phone: {
        type: Number,
        required: true,
        trim: true,
      },
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
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      country: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      region: {
        type: String,
        required: true,
        trim: true,
      },
      streetNumber: {
        type: Number,
      },
      houseNumber: {
        type: Number,
      },
      description: {
        type: String,
        trim: true,
      },
    },
    shippingDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["paypal", "cash on delivery"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { toJSON: { virtuals: true } }
);

OrderSchema.virtual("fullName").get(function () {
  return `${this.userInfo.firstName} ${this.userInfo.lastName}`;
});


OrderSchema.plugin(timestampPlugin);
module.exports = mongoose.model("Order", OrderSchema);
