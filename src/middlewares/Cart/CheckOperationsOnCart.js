const Cart = require("../../models/Cart/Cart");

module.exports = async (req, res, next) => {
  const userId = req._id;
  const {itemID, increment } = req.body;

  // Find the cart for the current user
  let cart = await Cart.findOne({ user: userId });


  // Find the item to be deleted
  let itemIndex = cart.items.findIndex((item) => item._id.equals(itemID));

  if (itemIndex >= 0) {
    req.itemIndex = itemIndex;
    // if (increment) {
    //   // Increment the quantity of the item

    //   if (cart.items[itemIndex].quantity >= 10) {
    //     return res.json({
    //       status: false,
    //       error: "Not Allowed More Than 10 Item in Each Cart",
    //     });
    //   }
      
    // }
 
    // Decrement the quantity of the item

    if (!increment && cart.items[itemIndex].quantity == 0) {
      return res.json({
        status: false,
        error: "Can Not Decrement More Than 0",
      });
    }
 
  } else {
    return res.json({
      status: false,
      error: "Item Not Found",
    });
  }
  next();
};
