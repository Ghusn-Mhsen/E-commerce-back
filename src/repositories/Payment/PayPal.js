const PayPal = require("../../models/Payment/PayPal");

class PayPalRepository {
  createPayPalDocument(json, user, order_id) {
    const doc = {
      user: user,
      order_id: order_id,
      paypal_payment_id: json.id,
      payer: {
        email: json.payer.payer_info.email,
        first_name: json.payer.payer_info.first_name,
        last_name: json.payer.payer_info.last_name,
        payer_id: json.payer.payer_info.payer_id,
      },
      transactions: json.transactions.map((transaction) => ({
        amount: {
          total: transaction.amount.total,
          currency: transaction.amount.currency,
        },
        payee: {
          merchant_id: transaction.payee.merchant_id,
          email: transaction.payee.email,
        },
        description: transaction.description,
        transaction_fee: {
          value: transaction.related_resources[0].sale.transaction_fee.value,
          currency:
            transaction.related_resources[0].sale.transaction_fee.currency,
        },
        create_time: transaction.related_resources[0].sale.create_time,
      })),
    };
    return doc;
  }

  async create(Obj) {
    return await PayPal.create(Obj);
  }

  async getPayPalPaymentByID(id) {
    return await PayPal.findOne({
      _id: id,
    });
  }

  async deletePayPalPaymentByID(id) {
    return await PayPal.deleteOne({
      _id: id,
    });
  }

  async getAllPayPalPayment(offset) {
    return await PayPal.find().skip(offset).limit(10);
  }
}

module.exports = new PayPalRepository();
