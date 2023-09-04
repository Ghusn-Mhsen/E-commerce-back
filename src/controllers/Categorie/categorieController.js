const CategorieRepositry = require('../../repositories/Categories/CateRepo');
const { PATH } = require("../../config/path");
const deleteFile = require("../..//utils/deleteFile");
class CategorieController{



    async createCategorie(req,res){
        try{
            const MerchantId=req._id;
            const HomePage=(req.role==1)
           const {arName,enName}=req.body;
          
           
           var { ImageOfCate } = req.files;
          //console.log(req.body);
           if (!arName || !enName || !ImageOfCate ) {
            return res.json({
            
                message:"your data isn't complete !!",
                status:false,
               
            })
        }
        ImageOfCate="Categorie\\"+ImageOfCate[0].filename;
        
          
           
           
           const cate= await CategorieRepositry.create({arName,enName,ImageOfCate ,MerchantId,HomePage});
           
           
           return res.json({
            message:"Creating Categorie Successfully",
            status:true,
            data:{
                categorie:cate
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
    async updateCategorie(req,res){
        try{
           
            const _id=req.params.id;
           const {arName,enName}=req.body;
          
           
           var { ImageOfCate } = req.files;
         if(ImageOfCate)
        ImageOfCate="Categorie\\"+ImageOfCate[0].filename;
        
          
        
           
           const cate= await CategorieRepositry.updateCate({_id,arName,enName,ImageOfCate});
           
           deleteFile({ path: PATH + cate.lastName });
           
           return res.json({
            message:"Updateing Categorie Successfully",
            status:true,
            data:{
                categorie:cate
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
    async getCategories(req,res){

        try{

         const MerchantId=req.query.owner;

         const cate=await CategorieRepositry.getCategories({MerchantId})
         return res.json({
            message:"get Categories Successfully",
            status:true,
            data:cate
           
          
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
    async deleteCategorie(req,res){

        try{

         const _id=req.params.id;

         const cate=await CategorieRepositry.delete(_id)
         deleteFile({ path: PATH + cate.ImageOfCate });
         return res.json({
            message:"delete Categorie Successfully",
            status:true,
            data:{
                categorie:cate
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
}
module.exports = new CategorieController();