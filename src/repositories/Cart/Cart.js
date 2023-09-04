const Cart = require("../../models/Cart/Cart");
const Product = require("../../models/ProductManagment/ProductModel");


class cartRepository {
  async addToCart({ userId, productId, classId, groupId, quantity = 1  }) {
    const cart = await Cart.findOne({ user: userId });
    const price = await getProductPrice({ productId, classId, groupId });

    // check if user cart exists
    if (!cart) {
      const item = {
        product: productId,
        class: classId,
        group: groupId,
        quantity:quantity
      };
  
      
      return await Cart.create({
        user: userId,
        items: [item],
        totalCost: price,
        
      });
    }

    const existingItem = cart.items.find((item) => {
      return (
        item.product.equals(productId) &&
        item.class.equals(classId) &&
        item.group.equals(groupId)
      );
    });


    if (existingItem)  {
      // Product already exists in cart, update quantity
      existingItem.quantity += quantity;
      await existingItem.save()
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({
        product: productId,
        class: classId,
        group: groupId,
        quantity,
      });
    }
 


    // Recalculate Total price
    cart.totalCost =  await RecalculateTotal(cart.items);
  
    return await cart.save();
  }

  addOfferToProduct(product){
    if(product.offers[0]){
     //   console.log("iamUnderOffer");
        const valOfDiscount=product.offers[0].valueOfOffer;
        for (let index = 0; index < product.Class.length; index++) {
            const element = product.Class[index];
            product.Class[index].priceAfterDiscount=(product.offers[0].typeOfOffer=="discount")?element.price-valOfDiscount:element.price-element.price*(valOfDiscount/100);
         //   console.log(element.priceAfterDiscount);
        }
        product.offers=undefined
       
    }
    //console.log(product);
    return product
}
async decrementItemOnCart({
  userId,
  itemIndex,
  increment = false,
  quantity = 1,
  groupId,
}) {
  try {
    // Find the cart for the current user
    let cart = await Cart.findOne({ user: userId });
 
// Increment or decrement the quantity based on the 'increment' flag
  if (increment==='true') {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items[itemIndex].quantity -= quantity;
  }

    // Remove the item from the cart if the quantity is less than or equal to 0
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
   

    // Recalculate Total price
    cart.totalCost = await RecalculateTotal(cart.items);

    return await cart.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

  async deleteUserCartByID(userId) {
    return await Cart
      .deleteOne({
        user: userId,
      })
  }

  async deleteProductFromCart({ userId, groupId, itemID }) {
    const cart = await Cart.findOne({
      user: userId,
    });

    // exit if user Cart not found
    if (!cart) return null;

    let itemIndex = cart.items.findIndex((item) => item._id.equals(itemID));

    // get item Quantity
    const quantity = cart.items[itemIndex].quantity;
    //  delete item from user Cart
    cart.items.splice(itemIndex, 1);
    // Recalculate Total price
    cart.totalCost = await RecalculateTotal(cart.items);

    return await cart.save();
  }

  async getUserCart(userId) {
    try {
      // Find the cart for the current user
      let cart = await Cart.findOne({ user: userId }).populate("items.product");

      var items = [];

      // check user cart exists
      if (!cart) return null;

      var totalPrice = await RecalculateTotal(cart.items);
   
      for (let item of cart.items) {
        var singleProduct = await getProductDetails(
          item.product,
          item.class,
          item.group
        );
        items.push({...singleProduct,itemID:item._id,quantity:item.quantity});
      }
      return {
        items,
        totalPrice
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

async function RecalculateTotal(items) {

  // Recalculate total price
  const productPromises = items.map(async (item) => {
    let product = await Product.findById(item.product).populate(
      "Class.group"
    );
    product =  addOfferToProduct(product);
    const classInfo = product.Class.find((classItem) =>
      classItem._id.equals(item.class)
    );

    const itemPrice =  classInfo.priceAfterDiscount ?? classInfo.price;
    return item.quantity * itemPrice;
  });

  const productPrices = await Promise.all(productPromises);
  const total = productPrices.reduce((sum, price) => sum + price, 0);

  return total;
}

async function getProductPrice({ productId, classId, groupId }) {
  let product = await Product.findById(productId).populate("Class.group");
  product =  addOfferToProduct(product);
  const classInfo = product.Class.find((classItem) =>
    classItem._id.equals(classId)
  );

  return classInfo.priceAfterDiscount ?? classInfo.price;
}
function addOfferToProduct(product){
  if(product.offers[0]){
   //   console.log("iamUnderOffer");
      const valOfDiscount=product.offers[0].valueOfOffer;
      for (let index = 0; index < product.Class.length; index++) {
          const element = product.Class[index];
          product.Class[index].priceAfterDiscount=(product.offers[0].typeOfOffer=="discount")?element.price-valOfDiscount:element.price-element.price*(valOfDiscount/100);
       //   console.log(element.priceAfterDiscount);
      }
      product.offers=undefined
     
  }
  //console.log(product);
  return product
}


async function getProductDetails(productId, classId, groupId) {
  const product = await Product.findById(productId).populate("Class.group");
  const classInfo = product.Class.find((classItem) =>
    classItem._id.equals(classId)
  );
  const groupInfo = classInfo.group.find((groupItem) =>
    groupItem._id.equals(groupId)
  );
  product.Class = undefined;
  classInfo.group = undefined;
  const object = {
    product: product,
    class: classInfo,
    group: groupInfo,
    
  };

  return object;
}

module.exports = new cartRepository();
