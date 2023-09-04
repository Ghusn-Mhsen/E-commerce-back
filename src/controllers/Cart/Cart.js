
const CartRepository = require("../../repositories/Cart/Cart");

class CartController {


    async addToCart(req, res) {
        try {
            const userId = req._id;
            const {productId,classId,groupId,quantity}= req.body;

           
           const  cart = await CartRepository.addToCart({
            userId,
            productId,
            classId,
            groupId,
            quantity
            });
           
            return res.json({
                message: "Add Product to Cart Successfully",
                status: true,
                data:cart

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const userId = req._id;
            const {groupId,itemID} = req.body;

           
           const  product = await CartRepository.deleteProductFromCart({
                userId,
                groupId,
                itemID,               
            });
            return res.json({
                message: "Delete Product from Cart Successfully",
                status: true,
                data:product

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }
    }

    async decrementItemOnCart(req, res) {
        try {
            const userId = req._id;
            const itemIndex = req.itemIndex;
          
            const {itemID,increment,groupId} = req.body;
            const  product = await CartRepository.decrementItemOnCart({
                userId,
                itemIndex,
                increment,
                groupId
            });
            return res.json({
                message: "Operation Done on Product Successfully",
                status: true,
                data:product

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }
    }
 


    async getUserCart(req, res) {
        try {
            const userID = req._id;

            let cart = await CartRepository.getUserCart(userID);

            return res.json({
                message: "Get User cart Successfully",
                status: true,
                data: cart

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async deleteUserCartByID(req, res) {
        try {
            const userID = req._id;

            let cart = await CartRepository.deleteUserCartByID(userID);

            return res.json({
                message: "Delete User Cart Successfully",
                status: true,
                data: cart

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }
   
   

}
module.exports = new CartController();