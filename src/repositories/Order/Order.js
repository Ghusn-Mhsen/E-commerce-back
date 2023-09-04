const Order = require("../../models/Order/Order");

const Cart = require("../../models/Cart/Cart");
const UserModel = require("../../models/UserManagment/UserModel");
const Product = require("../../models/ProductManagment/ProductModel");
const UserRepositories = require("../../repositories/UserManagment/UserRepository");
const ProductRepositories = require("../../repositories/ProductManagment/ProductRepositry");
const cartRepositories = require("../../repositories/Cart/Cart");
const mongoose = require("mongoose");
const moment = require("moment");
const web3Contoller = require("../../controllers/Web3Controller/web3Controller.Js");
const user = require("../../middlewares/auths/user");
class OrderRepository {
  async addOrder({ user, userInfo, shippingAddress, paymentMethod }) {
    const items = await this.getCartItems(user);
  
    const totalPrice = this.calculateTotalPrice(items);

    const order = new Order({
      user,
      userInfo,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    await this.decrementQuantityProducts({
      items,
    });
    await order.save();
    // await this.writeContract(order._id,true)
    
    await cartRepositories.deleteUserCartByID(user)

    return order;
  }

  async writeContract(orderID, state) {
    try {
      const order = await this.getOrderById(orderID);

      const { items, user, totalPrice } = order;

      const sellProducts = items.map(async (item) => {
        const { singleProduct, quantity } = item;
        const { product } = singleProduct;
      
        const { owner_id, manufacturingMaterial } = product;
        const { size } = singleProduct.class;
        console.log(owner_id);
       const owner=await UserRepositories.getUserByID(owner_id)
       let market="Main Market";
       if (owner)
       { market=owner.marketName }
     

await web3Controller.sellProduct(product._id, quantity,orderID, totalPrice,size, manufacturingMaterial, state, market,user);
       
      });

     
     return await Promise.all(sellProducts);
    
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getOrderById(orderID) {
    try {
      const order = await Order.findById({
        _id: orderID,
      }).populate("items.product");

      if (!order) {
        return null;
      }

      const items = await Promise.all(
        order.items.map(async (item) => {
          const singleProduct = await this.getProductDetails(
            item.product,
            item.class,
            item.group
          );
          item.class = undefined;
          item.group = undefined;
          item.product = undefined;

          return {
            ...item.toObject(),
            singleProduct,
          };
        })
      );

      return {
        ...order.toObject(),
        items,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserOrders(userID) {
    try {
      const order = await Order.find({
        user: userID,
      }).select({
        items: 0,
      });

      if (!order) {
        return null;
      }

      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const orders = await Order.find({}, { items: 0 });
      const totalPrice = orders.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
      return { orders, totalPrice };
    } catch (error) {
      throw error;
    }
  }

  async getProductDetails(productId, classId, groupId) {
    const product = await Product.findById(productId).populate("Class.group");
    const endGuarantee = this.calculateGuaranteeDaysLeft(product.Guarantee);
    const ownerProduct = await UserRepositories.getUserByID(product.owner_id);
    const classInfo = product.Class.find((classItem) =>
      classItem._id.equals(classId)
    );
    const groupInfo = classInfo.group.find((groupItem) =>
      groupItem._id.equals(groupId)
    );

    // Remove unnecessary fields from the class and group objects
    product.Class = undefined;
    product.offers = undefined;
    product.deliveryAreas = undefined;
    classInfo.group = undefined;
    classInfo.price = undefined;
    classInfo.priceAfterDiscount = undefined;
    classInfo.sallableInPoints = undefined;
    groupInfo.quantity = undefined;

    // Return the product, class, and group objects as a single object
    const object = {
      product: product,
      class: classInfo,
      group: groupInfo,
      Guarantee: endGuarantee,
      ownerProduct: ownerProduct,
    };

    return object;
  }
  async getBestSellingProductDetails(productId, classId, groupId) {
    const product = await Product.findById(productId).populate("owner_id");

    const classInfo = product.Class.find((classItem) =>
      classItem._id.equals(classId)
    );

    const groupInfo = classInfo.group.find((groupItem) =>
      groupItem._id.equals(groupId)
    );

    // Remove unnecessary fields from the class and group objects
    product.Class = undefined;
    classInfo.group = undefined;

    // Return the product, class, and group objects as a single object
    const object = {
      product: product,
      class: classInfo,
      group: groupInfo,
    };

    return object;
  }
  async getCartItems(userID) {
    const cart = await Cart.findOne({
      user: userID,
    }).select("items");

    const updatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const productID = item.product;
        const classID = item.class;

        const price = await this.getProductPrice({
          productId: productID,
          classId: classID,
        });

        return {
          ...item.toObject(),
          price,
        };
      })
    );

    return updatedItems;
  }
  async decrementQuantityProducts({ items }) {
    await Promise.all(
      items.map(async (item) => {
        const groupId = item.group;
        const quantity = item.quantity;

        return await ProductRepositories.decrementQuantity({
          groupId,
          quantity,
        });
      })
    );
  }
  async incrementQuantityProducts({ items }) {
    await Promise.all(
      items.map(async (item) => {
        const groupId = item.group;
        const quantity = item.quantity;

        return await ProductRepositories.incrementQuantity({
          groupId,
          quantity,
        });
      })
    );
  }
  async ChangeOrderStatus({ id, status }) {
    const order = await Order.findOne({
      _id: id,
    });

    const setObj = await this.getStatus(id, status, order.items);

    if (!setObj) {
      throw new Error("can not cancelled this order");
    }

    await Order.updateMany(
      {
        _id: id,
      },
      {
        $set: setObj,
      }
    );
    // if(status=="cancelled")
    // this.writeContract(id,false)

    return await this.getOrderById(id);
  }

  async ChangePaymentStatus(id, status) {
    await Order.updateMany(
      {
        _id: id,
      },
      {
        $set: { paymentStatus: status },
      }
    );
  }

  async getStatus(id, status, items) {
    var obj = {};
    switch (status) {
      case "pending": {
        obj.status = "pending";
        break;
      }
      case "processing": {
        obj.status = "processing";
        break;
      }
      case "shipped": {
        obj.status = "shipped";
        await this.updateShippingDate({
          id,
        });
        break;
      }
      case "delivered": {
        obj.status = "delivered";
        break;
      }
      case "cancelled": {
        const order = await this.getOrderById(id);
        if (order.status == "pending") {
          obj.status = "cancelled";
          await this.incrementQuantityProducts({
            items,
          });
          break;
        }
        return null;
      }
    }
    return obj;
  }

  async updateShippingDate({ id }) {
    const now = new Date();
    await Order.updateMany(
      {
        _id: id,
      },
      {
        $set: {
          shippingDate: now,
        },
      }
    );
  }

  async getProductPrice({ productId, classId }) {
    let product = await Product.findById(productId).populate("Class.group");
    product = this.addOfferToProduct(product);
    // console.log(product);
    const classInfo = product.Class.find((classItem) =>
      classItem._id.equals(classId)
    );

    return classInfo.priceAfterDiscount ?? classInfo.price;
  }

  addOfferToProduct(product) {
    if (product.offers[0]) {
      //   console.log("iamUnderOffer");
      const valOfDiscount = product.offers[0].valueOfOffer;
      for (let index = 0; index < product.Class.length; index++) {
        const element = product.Class[index];
        //0console.log(product.offers[0].typeOfOffer );
        product.Class[index].priceAfterDiscount =
          product.offers[0].typeOfOffer == "discount"
            ? element.price - valOfDiscount
            : element.price - element.price * (valOfDiscount / 100);
        //   console.log(element.priceAfterDiscount);
      }
      product.offers = undefined;
    }
    // console.log(product);
    return product;
  }

  calculateTotalPrice(items) {
    return items.reduce((total, item) => {
      const itemPrice = item.price;
      return total + item.quantity * itemPrice;
    }, 0);
  }
  calculateGuaranteeDaysLeft(guaranteeDay) {
    const now = new Date();
    const guaranteeEndDate = new Date(
      now.getTime() + guaranteeDay * 24 * 60 * 60 * 1000
    );
    const end = new Date(guaranteeEndDate);
    const diff = end.getTime() - now.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000; // number of milliseconds in one day
    const daysLeft = Math.floor(diff / oneDayMs);
    return daysLeft;
  }

  async getBestSellingProduct({ merchant_id }) {
    const query = this.matchMerchant(merchant_id);

    const result = await Order.aggregate([
      // unwind the products array to create a document for each product in the order
      {
        $unwind: "$items",
      },
      // get all information for product
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "products",
        },
      },
      // get product for specific Merchant
      {
        $match: query,
      },

      // group the products by product ID and sum the quantity sold for each product
      {
        $group: {
          _id: "$items.product",
          totalQuantitySold: {
            $sum: "$items.quantity",
          },
          class: {
            $first: "$items.class",
          },
          group: {
            $first: "$items.group",
          },
        },
      },
      //  sort the products by the total quantity sold in descending order
      {
        $sort: {
          totalQuantitySold: -1,
        },
      },
      // limit to the first result
      {
        $limit: 10,
      },
    ]);

    return Promise.all(
      result.map(async (item) => {
        return await this.getBestSellingProductDetails(
          item._id,
          item.class,
          item.group
        );
      })
    );
  }

  matchMerchant(merchant_id) {
    if (merchant_id)
      return {
        "products.owner_id": new mongoose.Types.ObjectId(merchant_id),
      };
    return {};
  }
  matchProductsOwner(merchant_id) {
    if (merchant_id) return { owner_id: merchant_id };
    return {};
  }

  async getProductWithQuantity(merchant_id) {
    const query = this.matchMerchant(merchant_id);
    const owner = this.matchProductsOwner(merchant_id);
    const results = await Order.aggregate([
      {
        $unwind: "$items",
      },

      // get all information for product
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "products",
        },
      },

      // get product for specific Merchant
      {
        $match: query,
      },
      {
        $group: {
          _id: "$items.product",
          quantitySold: { $sum: "$items.quantity" },
        },
      },
    ]);

    // Find the relevant Product documents and populate the class and group fields
    const products = await Product.find(owner).populate("Class.group");

    // Map over the products array and add the quantitySold property to each product document
    const items = products.map((product) => {
      // Find the corresponding object in the results array and extract the quantitySold property
      const result = results.find((result) => result._id.equals(product._id));
      const quantitySold = result ? result.quantitySold : 0;
      // Return a new object with the updated quantitySold property using the spread operator
      return { ...product.toObject(), quantitySold };
    });
    // Return the updated products array
    return items;
  }

  async getOrdersForMerchant(merchantId) {
    try {
      const orders = await Order.find()
        .populate("items.product")
        .populate("user");
      if (!orders) {
        return null;
      }
      const merchantOrders = orders.map((order) => {
        const itemsForMerchant = order.items.filter((item) =>
          item.product.owner_id.equals(merchantId)
        );
        const totalPrice = itemsForMerchant.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        const itemsCount = order.items.length;
        order.items = undefined;
        return { ...order.toObject(), itemsCount, totalPrice };
      });
      return merchantOrders;
    } catch (error) {
      throw error;
    }
  }

  async getOrderForMerchantById(orderID, merchantId) {
    try {
      const order = await Order.findById(orderID)
        .populate("items.product")
        .populate("user");
      if (!order) {
        return null;
      }

      const itemsForMerchant = order.items.filter((item) =>
        item.product.owner_id.equals(merchantId)
      );
      const items = await Promise.all(
        itemsForMerchant.map(async (item) => {
          const singleProduct = await this.getProductDetails(
            item.product._id,
            item.class,
            item.group
          );
          return {
            ...item.toObject(),
            class: undefined,
            group: undefined,
            product: undefined,
            singleProduct,
          };
        })
      );

      const { _id, user,status,shippingAddress,paymentMethod,paymentStatus,userInfo } = order;
      return { _id, user,userInfo,items,status,shippingAddress ,paymentMethod,paymentStatus,};
    } catch (error) {
      throw error;
    }
  }
  async getMerchantUsers(merchant_id) {
    try {
      const orders = await Order.find()
        .populate({
          path: "items",
          populate: {
            path: "product",
            match: { owner_id: merchant_id },
          },
        })
        .exec();
      // filter out any orders that don't have any items matching the specified merchant's products

      const filteredOrders = orders.filter((order) => {
        return order.items.some((item) => {
          return item.product !== null;
        });
      });
      // get users IDs
      const users = filteredOrders.map((order) => {
        return order.user;
      });
      // Get user Information
      return await Promise.all(
        users.map(async (user) => {
          return await UserRepositories.getUserByID(user);
        })
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }
  
  async getOrdersByStatus({ merchant_id }) {
    const query = this.matchMerchant(merchant_id);

    let result = await Order.aggregate([
      // unwind the products array to create a document for each product in the order
      {
        $unwind: "$items",
      },
      // get all information for product
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "products",
        },
      },
      // get product for specific Merchant
      {
        $match: query,
      },

      {
        $group: {
          _id: "$status",
          orders: { $addToSet: "$_id" },
        },
      },
    ]);
   
    return result;
  }

  // Calculate total revenue for all Order
  async getTotalRevenue() {
    const orders = await Order.find({});
    const totalRevenue = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );
    return totalRevenue;
  }
 

  async getTotalRevenueForEachMerchant() {
    const users = await UserModel.find({ role: 2 });
    const merchantOrders = await Promise.all(users.map(user => {
      return this.getOrdersForMerchant(user._id);
    }));
  
    const revenueByMerchant = merchantOrders.reduce((revenue, orders, i) => {
      const merchantName = users[i].fullName;
      if (!revenue[merchantName]) {
        revenue[merchantName] = { total: 0 };
      }
      revenue[merchantName].total += orders.reduce(
        (total, order) => total + order.totalPrice,
        0
      );
      return revenue;
    }, {});
  
    return revenueByMerchant;
  }

  

  // Calculate total quantity sold
  async getTotalQuantitySold() {
    const orders = await Order.find({});
    const totalQuantitySold = orders.reduce(
      (acc, order) =>
        acc + order.items.reduce((acc2, product) => acc2 + product.quantity, 0),
      0
    );
    return totalQuantitySold;
  }





async getTotalQuantitySoldForEachMerchant() {
  const users = await UserModel.find({ role: 2 });
  const orders = await Order.find({});

  const quantitySoldByMerchant = orders.reduce(async (quantity, order, i) => {
    const merchantName = users[i].fullName;
    if (!quantity[merchantName]) {
      quantity[merchantName] = 0;
    }
    
      for (const item of order.items) {
        const product = await ProductRepositories.getProductByID(item.product);
        if (product.owner_id._id.toString() === users[i]._id.toString()) {
          quantity[merchantName] += item.quantity;
        }
      }
    
    return quantity;
  }, {});

  return quantitySoldByMerchant;
}


  // Calculate average order value
  async getAverageOrderValue() {
    const orders = await Order.find({});
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );
    const averageOrderValue = totalRevenue / orders.length;
    return averageOrderValue;
  }

   // Calculate average order value for Each Merchant
   async  getAverageOrderValueForEachMerchant() {
    const users = await UserModel.find({ role: 2 });
    const merchantOrders = await Promise.all(users.map(user => this.getOrdersForMerchant(user._id)));
    
    const revenueByMerchant = merchantOrders.reduce((revenue, orders, i) => {
      const merchantName = users[i].fullName;
      if (!revenue[merchantName]) {
        revenue[merchantName] = { total: 0, numOrders: 0, averageOrderValue: 0 };
      }
      const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0);
      revenue[merchantName].total += totalRevenue;
      revenue[merchantName].numOrders += orders.length;
      revenue[merchantName].averageOrderValue = revenue[merchantName].total / revenue[merchantName].numOrders;
      return revenue;
    }, {});
  
    for (const merchantName in revenueByMerchant) {
      if (revenueByMerchant[merchantName].total === 0) {
        delete revenueByMerchant[merchantName];
      }
    }
  
    return revenueByMerchant;
  }
  // Get sales by date
  async getSalesByDate() {
    const orders = await Order.find({});
    const salesByDate = {};
    orders.forEach((order) => {
      const date = order.createdAt.toDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += order.totalPrice;
    });
    return salesByDate;
  }

 // Get sales by date for Each Merchant
 async  getSalesByMonthForEachMerchant() {
  const users = await UserModel.find({ role: 2 });
  const merchantOrders = await Promise.all(users.map(user => this.getOrdersForMerchant(user._id)));

  const salesByMerchantAndMonth = {};
  merchantOrders.forEach((orders, index) => {
    const merchantName = users[index].fullName;
   
    if (!salesByMerchantAndMonth[merchantName]) {
      salesByMerchantAndMonth[merchantName] = {};
    }
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.getMonth(); // get the month (0-based index)
      if (!salesByMerchantAndMonth[merchantName][month]) {
        salesByMerchantAndMonth[merchantName][month] = 0;
      }
      salesByMerchantAndMonth[merchantName][month] += order.totalPrice;
    });
  });

  // Delete entries with a value of 0
  for (let merchant in salesByMerchantAndMonth) {
    for (let month in salesByMerchantAndMonth[merchant]) {
      if (salesByMerchantAndMonth[merchant][month] === 0) {
        delete salesByMerchantAndMonth[merchant][month];
      }
    }
  }

  return salesByMerchantAndMonth;
}
  
 

  // Get sales by product category
  async getSalesByProductCategory() {
    const orders = await Order.find({});
    const salesByCategory = {};
    for (const order of orders) {
      for (const item of order.items) {
        const product = await Product.findById(item.product).populate(
          "Class.group"
        );
        const category = product.mainCategorie;

        if (!salesByCategory[category]) {
          salesByCategory[category] = 0;
        }
        salesByCategory[category] += item.quantity * item.price;
      }
    }
    return salesByCategory;
  }

  // Get average order processing time
  async getAverageOrderProcessingTime() {
    const orders = await Order.find({}).where("shippingDate").ne(null);
    const averageProcessingTime =
      orders.reduce((acc, order) => {
        const createdAt = moment.utc(order.createdAt);
        const shippingDate = moment.utc(order.shippingDate);
        const processingTime = shippingDate.diff(createdAt);
        return acc + processingTime;
      }, 0) / orders.length;
    return moment.duration(averageProcessingTime, "seconds").asHours();
  }
  deleteItemsMatchNull(items) {
    const newItems = items.filter((item) => item.product !== null);

    // Calculate the total price of the remaining items
    let totalPrice = this.calculateTotalPrice(newItems);

    // Return the new array of items and the recalculated total price
    return { items: newItems, totalPrice };
  }

  

  async advancedSearch({
    offset,
    merchant_id,
    firstName,
    lastName,
    email,
    phone,
    status,
    totalPrice,
    country,
    city,
    region,
    streetNumber,
    houseNumber,
    shippingDate,
    paymentMethod,
    paymentStatus,
  }) {
    // Build the base query
    let query = Order.find();

    // Add filters for userInfo
    if (firstName)
      query.where("userInfo.firstName").regex(new RegExp(firstName, "i"));
    if (lastName)
      query.where("userInfo.lastName").regex(new RegExp(lastName, "i"));
    if (email) query.where("userInfo.email").equals(email);
    if (phone) query.where("userInfo.phone").equals(phone);

    // Add filters for shippingAddress
    if (country)
      query.where("shippingAddress.country").regex(new RegExp(country, "i"));
    if (city) query.where("shippingAddress.city").regex(new RegExp(city, "i"));
    if (region)
      query.where("shippingAddress.region").regex(new RegExp(region, "i"));
    if (houseNumber)
      query.where("shippingAddress.houseNumber").equals(houseNumber);
    if (streetNumber)
      query.where("shippingAddress.streetNumber").equals(streetNumber);

    // Add filters for status, totalPrice, paymentMethod, and paymentStatus
    if (status) query.where("status").equals(status);
    if (totalPrice) query.where("totalPrice").equals(totalPrice);
    if (paymentMethod) query.where("paymentMethod").equals(paymentMethod);
    if (paymentStatus) query.where("paymentStatus").equals(paymentStatus);

    // Add filter for items owned by merchant_id
    if (merchant_id) {
      query.populate({
        path: "items",
        populate: {
          path: "product",
          match: { owner_id: merchant_id },
        },
      });
    }

    // Execute the query
    const results = await query.skip(offset).limit(10).exec();

    // Process results for merchant_id query
    if (merchant_id) {
      let totalPrice = 0;
      const newResults = results.filter((order) => {
        const newItems = this.deleteItemsMatchNull(order.items);
        totalPrice = newItems.totalPrice;
        order.totalPrice = newItems.totalPrice;
        order.items = undefined;
        return newItems.items.length > 0;
      });

      return { data: newResults };
    }

    // Return results as-is
    return results;
  }
}

module.exports = new OrderRepository();
