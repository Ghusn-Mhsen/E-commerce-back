const Product = require("../../models/ProductManagment/ProductModel");

module.exports = async (req, res, next) => {
  const { productId, classId, groupId } = req.body;
  let { increment } = req.body;

  increment = typeof increment === 'undefined'?true:increment


  
 
  const product = await Product.findById(productId).populate("Class.group");
  const classInfo = product.Class.find((classItem) =>classItem._id.equals(classId));
  const groupInfo = classInfo.group.find((groupItem) =>groupItem._id.equals(groupId));

  if (groupInfo.quantity <=0 && increment) {
    return res.json({
      status: false,
      error:
        "There Is NO  Quantity Enough ",
    });

  }
  
  next();
};
