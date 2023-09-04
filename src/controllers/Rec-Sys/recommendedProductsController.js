const recommendedProductsRepositry = require("../../repositories/recommendedProduct/recommendedProductsRepositry");
// const tf = require('tensorflow-node');
const {recommendProducts}=require('../../middlewares/recSys/recommandationSystem')





class recommendedProductsController {
  

    async getRecommendedProductsWithoutML(req, res) {
        try {
            const customerProducts = await recommendedProductsRepositry.getOrdersOfCustomer({customerId :req._id});
            const similarProducts = await recommendedProductsRepositry.getSimilarProducts({customerProductIds:customerProducts,customerId :req._id});
            const recommendedProducts = await recommendedProductsRepositry.getRecommandedProducts({ similarProducts: similarProducts });
            res.status(200).json({
                status: true,
                recommendedProducts: recommendedProducts
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: false, err: err.toString() })
        }
    }

    async getRecommendedProductsWithML(req, res) {
        try {
            const  userId  = req._id;

        
            
  // Get recommendations for the user
  const recommendations = await recommendProducts(userId);
  
          
            res.status(200).json({
                status: true,
                recommendedProducts: recommendations
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: false, err: err.toString() })
        }
    }
   
    
}

module.exports = new recommendedProductsController();