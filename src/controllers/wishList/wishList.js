
const wishListRepository = require("../../repositories/wishList/wishList");

class WishListController {


    async addProduct(req, res) {
        try {
            const owner_id = req._id;
            const product_id = req.body;

           
           const  wishList = await wishListRepository.addProduct({
                owner_id,
                product_id
               
            });
            console.log(wishList);
            return res.json({
                message: "Add Product to wishList Successfully",
                status:true,
                data:wishList

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }
    }

    async removeProduct(req, res) {
        try {
            const owner_id = req._id;
            const product_id = req.body;

           
           const  wishList = await wishListRepository.removeProduct({
                owner_id,
                product_id
               
            });
            console.log(wishList);
            return res.json({
                message: "Remove Product from wishList Successfully",
                status: true,
                data:wishList

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }
    }


    async getWishListByUserID(req, res) {
        try {
            const userID = req._id;

            let wishList = await wishListRepository.getWishListByUserID(userID);

            return res.json({
                message: "Get User wishList Successfully",
                status: true,
                data: wishList

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async deleteWishListByUserID(req, res) {
        try {
            const userID = req._id;

            let wishList = await wishListRepository.deleteWishListByUserID(userID);

            return res.json({
                message: "Delete User wishList Successfully",
                status: true,
                data: wishList

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
module.exports = new WishListController();