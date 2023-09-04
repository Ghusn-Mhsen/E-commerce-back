const BannerRepositry = require('../../repositories/Banner/BannerRepositry');




const { PATH } = require("../../config/path");
const deleteFile = require("../..//utils/deleteFile");
class BannerController{



    async createBanner(req, res) {
        try {
          const { endDate } = req.body;
          const files = req.files;
          if (!files || !files.length || !endDate) {
            return res.status(500).json({
              message:"your data isn't complete !!",
              status:false
            });
          }
      
          const banner = files.map(file => {
            return {
              content: "banner\\" + file.filename,
              endDate: endDate
            };
          });
      
          const resultBanner = await BannerRepositry.createBanner(banner);
      
          return res.status(201).json({
            message: "adding Banner Successfully",
            status: true,
            data: {
              banner: resultBanner
            }
          });
        } catch(err) {
          console.log(err);
          return res.status(500).json({
            message: err.toString(),
            status: false
          });
        }
      }
   
    async getBanners(req,res){

        try{

       
            console.log(req.host);

         const banners=await BannerRepositry.getBanners()
        
         return res.status(200).json({
            message:"get bANNERS Successfully",
            status:true,
            data:{
                banners:banners
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
    async deleteBanner(req,res){

        try{

         const _id=req.params.id;

         const banner=await BannerRepositry.delete(_id)
         deleteFile({ path: PATH + banner.content });
         return res.status(200).json({
            message:"delete Banner Successfully",
            status:true,
            
          
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
module.exports = new BannerController();