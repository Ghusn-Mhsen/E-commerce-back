const Product = require("../../models/ProductManagment/ProductModel");
const orderRepositories = require("../../repositories/Order/Order");

module.exports = async (req, res, next) => {
  const  id  = req._id;

  const items = await orderRepositories.getCartItems(id);

  for (const item of items) {
    const product = await Product.findById(item.product).populate("Class.group");
    const classInfo = product.Class.find((classItem) =>classItem._id.equals(item.class));
    const groupInfo = classInfo.group.find((groupItem) =>groupItem._id.equals(item.group));
    if (groupInfo.quantity < item.quantity) {
      return res.json({
        status: false,
        error:`Product ${product.name} does not have enough quantity`,
      });
    }
  }  
  next();
};
