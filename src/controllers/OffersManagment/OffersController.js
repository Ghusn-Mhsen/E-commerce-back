
const ProductRepositry = require("../../repositories/ProductManagment/ProductRepositry");

class OffersController {


    async createOffer(req,res){
        try{
         
          // const productId=req.params.id;
           const{endDateOfOffers,startDateOfOffers,valueOfOffer,typeOfOffer,productsIds}=req.body;
         
           
           if (!productsIds ||!endDateOfOffers ||!typeOfOffer || !startDateOfOffers || !valueOfOffer||  !(new Date(startDateOfOffers).getTime()<new Date (endDateOfOffers).getTime())) {
            return res.json({
            
                message:"your data isn't complete_True !!",
                status:false,
               
            })
        }
         
            const newproduct=await ProductRepositry.createOffer({productsIds,endDateOfOffers,startDateOfOffers,valueOfOffer,typeOfOffer});
        
            if(newproduct){ 
                return res.json({
                message:"adding offer for Product Successfully",
                status:true,
               
              
            })}
            else{
                
                return res.json({
                    message:"Creating Offer unSuccessfully,there are an offers in same Time",
                    status:false,
                  
                })
            }
           

        }
        catch(err){
            console.log(err);
  return res.json({
                message:err.toString(),
                status:false,
              
            })
        }
    }
    async getMerchantoffers(req,res){
try{
    let limit = 10 // Number OF Post that Return in Every Request 
    let offset = 0 + (req.query.page - 1) * limit // Get last Index that Get in previous Request 
    const products=await ProductRepositry.getAllOffersByMerchantID(offset,req.params.id)
    return res.json({
        message:"get MerchantOffers Successfully",
        status:true,
        data:{
            products:products
        }
      
    })
}
catch(err){
    console.log(err);
return res.json({
        message:"get MerchantOffers UnSuccessfully",
        status:false,
      
    })
}
    }
    async getMerchantActiveoffers(req,res){
        try{
            let limit = 10 // Number OF Post that Return in Every Request 
            let offset = 0 + (req.query.page - 1) * limit // Get last Index that Get in previous Request 
            const products=await ProductRepositry.getActiveOffersByMerchantID(offset,req.query.owner)
            return res.json({
                message:"get MerchantOffers Successfully",
                status:true,
                data:{
                    products:products
                }
              
            })
        }
        catch(err){
            console.log(err);
        return res.json({
                message:err.toString(),
                status:false,
              
            })
        }
            }
    async getoffersByProductId(req,res){
        try{
             
            const products=await ProductRepositry.getAllOffersByProductID(req.params.id)
          
            return res.json({
                message:"get ProductOffers Successfully",
                status:true,
                data:{
                    product:products
                }
              
            })
        }
        catch(err){
            console.log(err);
        return res.json({
                message:err.toString(),
                status:false,
              
            })
        }
            }
  

 
    async updateOfferInfo(req,res){
                                try{
                                 
                                 const productId=req.params.id;
           const{ActiveUser,endDateOfOffers,startDateOfOffers,valueOfOffer,typeOfOffer,offerId}=req.body;
                            
                                const newproduct=  await ProductRepositry.updateOffer({productId,offerId,endDateOfOffers,startDateOfOffers,valueOfOffer,typeOfOffer,ActiveUser})
                                 if(newproduct){ return res.json({
                                    message:"update Info of offer Successfully",
                                    status:true,
                                    data:{
                                        product:newproduct
                                    }
                                  
                                })}
                                else{
                                    return res.json({
                                        message:"update Info of offer unSuccessfully,this product isn't for you",
                                        status:false,
                                      
                                    }) 
                                }
                                }catch(err){
                                    console.log(err);
                                return res.json({
                                        message:err.toString(),
                                        status:false,
                                      
                                    })
                                }
                                
                            }
  
    
}
module.exports = new OffersController();