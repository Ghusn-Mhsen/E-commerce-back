const HotSellsRepo = require("../../repositories/HotSells/HotSellsRepo");


function addOfferToProduct(product) {
    if (product.offers[0]) {
     
        const valOfDiscount = product.offers[0].valueOfOffer;
        for (let index = 0; index < product.Class.length; index++) {
            const element = product.Class[index];
            product.Class[index].priceAfterDiscount = (product.offers[0].typeOfOffer == "discount") ? element.price - valOfDiscount : element.price - element.price * (valOfDiscount / 100);
          
        }
        product.offers = undefined

    }
 
    return product
}

class HotSellsController{

    async addToHotSelling(req,res){
        try{
           
       
          
          const product_id=req.params.id;
          
            const influncer_id=req._id;


            const HomeTrend=(req.role==1)
           const {ToHomeTrend,endDate}=req.body
       
        const newproduct=  await HotSellsRepo.addToTrend({product_id,influncer_id,HomeTrend,ToHomeTrend,endDate})
        console.log(newproduct);
        if(newproduct){ return res.json({
            message:"adding Product To Trend Successfully",
            status:true,
           
          
        })}
     
        }catch(err){
           
        return res.json({
                message:err.toString(),
                status:false,
              
            })
        }
        
    }
    async removeFromHotSelling(req,res){
        try{
           
       
          
          const _id=req.params.id;
        
          
        const newproduct=  await HotSellsRepo.removeFromTrend({_id})
        
        if(newproduct){ return res.json({
            message:"remove Product From Trend Successfully",
            status:true,
           
          
        })}
        return res.json({
            message:"This Product Isn't Trend",
            status:false,
          
        })
        }catch(err){
           
        return res.json({
                message:err.toString(),
                status:false,
              
            })
        }
        
    }
    /*async getHotSelling(req,res){
        try{
           
       
          
          const influncer_id=req.query.id;
          
        
          
        const newproduct=  await HotSellsRepo.getHotSelling({influncer_id})
    
        if(newproduct){ 
            
            const products=[]
            var i=0
              newproduct.map((element)=>{
                element._id=undefined
                element.product=addOfferToProduct(element.product)
                element.offers=undefined
                products[i]=element.product
                i++
                
            })
            return res.json({
            message:"get Product From Trend Successfully",
            status:true,
            data:{
                products:newproduct
            }
           
          
        })}
     
        }catch(err){
           console.log(err);
        return res.json({
                message:err.toString(),
                status:false,
              
            })
        }
        
    }*/
    async getHotSelling(req, res) {
        try {
            const influncer_id = req.query.id;
            const newproduct = await HotSellsRepo.getHotSelling({ influncer_id });
    
            if (newproduct) {
                const products = newproduct.map(element => {
                    const { product } = element;
                    const modifiedProduct = addOfferToProduct(product);
                    return {
                        _id: modifiedProduct._id,
                        name: modifiedProduct.name,
                        mainCategorie: modifiedProduct.mainCategorie,
                        Class: modifiedProduct.Class,
                        Guarantee: modifiedProduct.Guarantee,
                        manufacturingMaterial: modifiedProduct.manufacturingMaterial,
                        mainImage: modifiedProduct.mainImage,
                        offers: modifiedProduct.offers
                    };
                });
    
                return res.json({
                    message: "get Trend Products Successfully",
                    status: true,
                    data: {
                        products
                    }
                });
            }
        } catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,
            });
        }
    }
    
  
    async getHotSellingToBeHotTrend(req,res){

        try{
           
       
          const newproduct=  await HotSellsRepo.getHotSellingToBeInHomeTrend()
      
          if(newproduct){ 
              
            const products=[]
            var i=0
              newproduct.map((element)=>{
                element._id=undefined
                element.product=addOfferToProduct(element.product)
                element.offers=undefined
                products[i]=element.product
                i++
                
            }
                )
              return res.json({
              message:"get Product To Be In Trend Successfully",
              status:true,
              data:{
                  products:products
              }
             
            
          })}
       
          }catch(err){
             console.log(err);
          return res.json({
                  message:err.toString(),
                  status:false,
                
              })
          }
    }
    async acceptInHomeTrend(req,res){
        try{
           
       
          
          const _id=req.params.id;
        
          
        const newproduct=  await HotSellsRepo.addingToHomeTrend(_id)
        console.log(newproduct);
        if(newproduct){ return res.json({
            message:"adding Product To Home Trend Successfully",
            status:true,
           
          
        })
    }
        return res.json({
            message:"This Product Isn't Trend",
            status:false,
          
        })
        }catch(err){
           
        return res.json({
                message:err.toString(),
                status:false,
              
            })
        }
        
    }
}
module.exports = new HotSellsController();