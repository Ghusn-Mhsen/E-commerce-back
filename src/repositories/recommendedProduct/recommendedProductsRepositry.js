const OrderModel = require('../../models/Order/Order');
const ProductModel=require('../../models/ProductManagment/ProductModel')

class recommendedProductsRepositry {

  async getOrdersOfCustomer({customerId}){

 const customerOrders= await OrderModel.find({ user: customerId })
   const customerProductIds = customerOrders.flatMap((order) => order.items.map((item) => item.product));
        return customerProductIds;
  }
  async getSimilarProducts({customerProductIds,customerId}){
    const similarOrders= await OrderModel.find({ 'items.product': { $in: customerProductIds } }).ne('user', customerId)
   // const similarOrders = await recommendedProductsRepositry.getSimilarProducts({ customerProductIds: customerProductIds ,customerId:customerId});
    const similarProductIds = similarOrders.flatMap((order) => order.items.map((item) => item.product));
    const productFrequency = similarProductIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});
    const sortedProductIds = Object.keys(productFrequency).sort((a, b) => productFrequency[b] - productFrequency[a]);
    return sortedProductIds;
  }
  async getRecommandedProducts({similarProducts}){
    return await ProductModel.find({ _id: { $in: similarProducts } }).limit(10);
  }

}



module.exports = new recommendedProductsRepositry();
