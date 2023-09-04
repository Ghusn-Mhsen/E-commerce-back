


const Categorie = require('../../models/Cate/categorie');
const mongoose = require('mongoose');

class CategorieRepositry {

  async create({ arName, enName, MerchantId, HomePage,ImageOfCate }) {

    
    return await Categorie.create({  arName, enName, MerchantId, HomePage,ImageOfCate  });
  }




  async getCategories({MerchantId}) {


    return(MerchantId)? await Categorie.find({
      "MerchantId":  new mongoose.Types.ObjectId(MerchantId),


    },

      



    ):await Categorie.find({
        "HomePage": true,
  
  
      },
  
        
  
  
  
      )
  }
  async updateCate({_id,arName,enName,ImageOfCate}){
    let categorie = await Categorie.findById(_id)
      const lastName=categorie.ImageOfCate;
    categorie.arName = arName ?? categorie.arName;
    categorie.enName = enName ?? categorie.enName;
    categorie.ImageOfCate = ImageOfCate ?? categorie.ImageOfCate;

  categorie= await categorie.save();
  categorie.lastName=lastName
  return categorie
    
  }
  async delete(_id){
    return await Categorie.findByIdAndDelete(_id)

   

  }

}



module.exports = new CategorieRepositry();