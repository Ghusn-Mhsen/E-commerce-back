
const wishList = require('../../models/wishList/wishList');


class WishListRepository {

    async addProduct({
        owner_id,
        product_id
    }) {

        const userWishList = await wishList.findOne({
            owner_id: owner_id
        });


        if (!userWishList) {
            return await wishList.create({
                owner_id: owner_id,
                products: [product_id]
            })
        } else {
           
            const product = await wishList.findOne({
                products: {
                    $elemMatch: product_id
                }
            })
            if(!product){
              
                return await wishList.updateOne({
                    owner_id: owner_id
                }, {
                    $push: {
                        products: product_id
                    }
                })
            }
           

            return null;
         
        }


    }


    async removeProduct({
        owner_id,
        product_id
    }) {

        const userWishList = await wishList.findOne({
            owner_id: owner_id
        });


        if (!userWishList) {
            return null
        }
        return await wishList.updateOne({
            owner_id: owner_id
        }, {
            $pull: {
                products: product_id
            }
        })

    }

    async getWishListByUserID(userId) {

        return await wishList.findOne({
            owner_id: userId
        }).populate('owner_id').populate('products.product_id');
    }

    async deleteWishListByUserID(userId) {

        return await wishList.deleteOne({
            owner_id: userId
        });
    }
}

module.exports = new WishListRepository();