var paypal = require("paypal-rest-sdk");
const OrderRepositories = require("../../repositories/Order/Order");
const PayPalRepositories = require("../../repositories/Payment/PayPal");
const Web3ControllerJs = require("../Web3Controller/web3Controller.Js");
class PayPalController {
  async create(req, res) {
    const { orderId, points } = req.query;

    const order = await OrderRepositories.getOrderById(orderId);
    const user = order.user;
    //BlockChain
    // if (points) {
    //   const userBalance = await Web3ControllerJs.getLoyaltyPoints(user);
    //   if (order.totalPrice > userBalance) {
    //     await Web3ControllerJs.removeLoyaltyPoints(userBalance * 100, user);
    //     order.totalPrice = order.totalPrice - userBalance;
    //   } else {
    //     await Web3ControllerJs.removeLoyaltyPoints(order.totalPrice, user);
    //     order.totalPrice = 0;
    //   }
    // }

    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://${req.ip.replace(
          "::ffff:",
          ""
        )}:3000/user/Customer/paypal/success?orderId=${orderId}&total=${
          order.totalPrice
        }&user=${user}`,
        cancel_url: `http://${req.ip.replace(
          "::ffff:",
          ""
        )}:3000/user/Customer/paypal/Cancel?orderId=${orderId}`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "item",
                sku: "item",
                price: `${order.totalPrice}`,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: `${order.totalPrice}`,
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        throw error;
      } else {
        for (var index = 0; index < payment.links.length; index++) {
          //Redirect user to this endpoint for redirect url
          if (payment.links[index].rel === "approval_url") {
            res.redirect(payment.links[index].href);
          }
        }
      }
    });
  }

  async success(req, res) {
    const { paymentId, PayerID, total, orderId, user } = req.query;
    var execute_payment_json = {
      payer_id: PayerID,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: `${total}`,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          const doc = PayPalRepositories.createPayPalDocument(
            payment,
            user,
            orderId
          );

          await PayPalRepositories.create(doc);

          await OrderRepositories.ChangePaymentStatus(orderId, "completed");
        }
      }
    );
  }
  async Cancel(req, res) {
    const { orderId } = req.query;
    await OrderRepositories.ChangePaymentStatus(orderId, "cancelled");

    return res.json({
      message: "Cancel PayPal Payment Successfully",
      status: true,
      data: null,
    });
  }
  async getPayPalPaymentByID(req, res) {
    try {
      const id = req.params.id;

      let payment = await PayPalRepositories.getPayPalPaymentByID(id);

      return res.json({
        message: "get PayPal Payment Successfully",
        status: true,
        data: payment,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }

  async deletePayPalPaymentByID(req, res) {
    try {
      const id = req.params.id;

      let payment = await PayPalRepositories.deletePayPalPaymentByID(id);

      return res.json({
        message: "Delete PayPal Payment Successfully",
        status: true,
        data: payment,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }
  async getAllPayPalPayment(req, res) {
    try {
      let limit = 10; // Number OF Post that Return in Every Request
      let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request

      let payment = await PayPalRepositories.getAllPayPalPayment(offset);

      return res.json({
        message: "get All PayPal Payment Successfully",
        status: true,
        data: payment,
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

module.exports = new PayPalController();
