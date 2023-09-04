


const Product = require('../../models/ProductManagment/ProductModel');
const mongoose = require('mongoose');

class ProductRepositry {

  async create({ name, descreption, mainCategorie, manufacturingMaterial, Guarantee, Class, owner_id,HomePage }) {

    
    return await Product.create({ name, descreption, mainCategorie, manufacturingMaterial, Guarantee, Class, owner_id,HomePage });
  }




  async getProductByID(productId) {
    const today = new Date();

    return await Product.findOne({
      "_id": productId,


    },

      {
        _id: 1,
        name: 1,
        descreption: 1,
        Class: 1,
        Guarantee: 1,
        mainCategorie: 1,
        owner_id: 1,
        deliveryAreas:1,
        manufacturingMaterial: 1,
        offers: {
          $elemMatch: {
            startDateOfOffers: { $lte: today },
            endDateOfOffers: { $gte: today },
            ActiveUser: true
          }
        }
      },



    ).populate("owner_id", { "fullName": 1 });
    /* return await Product.findOne(
         {_id: productId }
     ).select({ "gallery":0,"mainImage":0,"offers":0}).populate("owner_id",{"name":1});*/
  }
  async getGalProductByID(productId) {

    return await Product.findOne({
      _id: productId
    }).select({ "gallery": 1, "mainImage": 1 });
  }
  async getARProductByID(productId) {

    return await Product.findOne({
      _id: productId
    }).select({ "arImage": 1, });
  }
  async getVRProductByID(productId) {

    return await Product.findOne({
      _id: productId
    }).select({ "vrImage": 1, });
  }
  async getVideoProductByID(productId) {

    return await Product.findOne({
      _id: productId
    }).select({ "mainVideo": 1, });
  }
  async addImagesToProd({ id, mainImage, gallery }) {
    let product = await Product.findById(id)
    
    product.mainImage = mainImage;
    product.gallery = gallery;
    return await product.save();
     
  }
  async addVideoToProd({ id, mainVideo }) {
    const product = await Product.findById(id)
    product.mainVideo = mainVideo;

    return await product.save();

  }
  async addVRToProd({ id, vrImage }) {
    const product = await Product.findById(id)
    product.vrImage = vrImage;

    return await product.save();
  }
  async addARToProd({ id, arImage }) {
    const product = await Product.findById(id)
    product.arImage = arImage;

    return await product.save();
  }
  async addDeliveryAreas({id,areas}){
    const product= await Product.findById(id);
    product.deliveryAreas=areas;
    return await product.save()
  }
  
  async updateProductInfo({ id, name, descreption, mainCategorie, manufacturingMaterial, Guarantee }) {
    
    const product = await Product.findById(id)

    product.name = name ?? product.name;
    product.descreption = descreption ?? product.descreption;
    product.mainCategorie = mainCategorie ?? product.mainCategorie;
    product.manufacturingMaterial = manufacturingMaterial ?? product.manufacturingMaterial;
    product.Guarantee = Guarantee ?? product.Guarantee;
    return await product.save();



  }
  async updateClassInProductInfo({ id, price, size, length, width, sallableInPoints }) {
    return await Product.findOneAndUpdate({ "Class": { $elemMatch: { _id: id } } },
      {
        $set: {
          'Class.$.price': price,
          'Class.$.size': size,
          'Class.$.length': length,
          'Class.$.width': width,
          'Class.$.sallableInPoints': sallableInPoints,
        }
      },
      { new: true }
    )




  }
  async updateGroupInClassInProductInfo({ id, color, quantity }) {


    /*return await Product.findOneAndUpdate(
        { 'Class.group._id':id},
      {
          $set:{
              'Class.$[i].group.$[j].color':color,
              'Class.$[i].group.$[j].quantity':quantity,
             
          },
         
      },
      {new:true,
    arrayFilters:[
        {'i._id':id},
        {'j._id':id}
    ]
    }
      )*/



    const newProduct = await Product.findOne(
      { "Class.group._id": id },

    )
    newProduct.Class.map((element) => {
      element.group.map((element) => {

        if (element._id == id) {

          element.color = color ?? element.color;
          element.quantity = quantity ?? element.quantity
        }
      })

    })

    return await newProduct.save()





  }





  async getAllProductByMerchantID(offset, owner_id) {
    const today = new Date();

    
    return await Product.find(
     {
      
      owner_id: new mongoose.Types.ObjectId(owner_id) } , // filter to find the specific product by ID.
      {
      
       
          _id: 1,
          name: 1,
          description: 1,
          Class: 1,
          Guarantee: 1,
          mainCategorie: 1,
          manufacturingMaterial: 1,
          mainImage: 1,
          offers: {
            $elemMatch: {
              startDateOfOffers: { $lte: today },
              endDateOfOffers: { $gte: today },
              ActiveUser: true
            }
          }
        
      }, // only include offers that meet the specified conditions.
      { $skip: offset }, // skip the first "offset" documents.
      { $limit: 10 } // return "limit" documents after the skipped ones.
    );

  }

  //get all products which it has offers (Active and NotActive)
  async getAllOffersByMerchantID(offset, owner_id) {

    return await Product.find({ $and: [{ "offers.0": { "$exists": true } }, { 'owner_id': owner_id }] }).skip(offset).limit(10).select({ name: 1, Class: 1, Guarantee: 1, mainImage: 1, offers: 1 });
  }

  // get products which it has Active offers  offers in market
  async getActiveOffersByMerchantID(offset, owner_id) {

    const today = new Date();

   
    return (owner_id)? 
    await Product.find({
      "offers.startDateOfOffers": { $lte: today },
      "offers.endDateOfOffers": { $gte: today },
      "offers.ActiveUser": true,
      'owner_id': owner_id

    },
      {
        _id: 1,
        mainCategorie:1,
        mainImage:1,
        Class:1,
        descreption:1,
        Guarantee:1,
        manufacturingMaterial:1,
        name: 1,
        descreption:1,
        offers: {
          $elemMatch: {
            startDateOfOffers: { $lte: today },
            endDateOfOffers: { $gte: today },
            ActiveUser: true
          }
        }
      }).skip(offset).limit(10).exec():
       await Product.find({
        "offers.startDateOfOffers": { $lte: today },
        "offers.endDateOfOffers": { $gte: today },
        "offers.ActiveUser": true,
        'HomePage': true
  
      },
        {
          _id: 1,
          mainCategorie:1,
          mainImage:1,
          Class:1,
          descreption:1,
          Guarantee:1,
          manufacturingMaterial:1,
          name: 1,
          offers: {
            $elemMatch: {
              startDateOfOffers: { $lte: today },
              endDateOfOffers: { $gte: today },
              ActiveUser: true
            }
          }
        }).skip(offset).limit(10).exec();;
    //  return await Product.find({$and:[{ "offers.0": { "$exists": true } },{'owner_id':owner_id}]} ).skip(offset).limit(10).select({name:1,Class:1,Guarantee:1,mainImage:1,offers:1});
  }
  


  async getAllOffersByProductID(id) {

    return await Product.findOne({ _id: id }).select({ offers: 1, });
  }
  async getAllProductByCategorie({ offset, mainCategory, owner_id }) {
const today=new Date()

return(owner_id)? 
 await Product.find(
       { owner_id: new mongoose.Types.ObjectId(owner_id),mainCategorie: mainCategory  },
     
    // filter to find the specific product by ID.
      {
       
          offers: {
            $elemMatch: {
              startDateOfOffers: { $lte: today },
              endDateOfOffers: { $gte: today },
              ActiveUser: true
            }
          },
          _id: 1,
          name: 1,
          mainImage: 1,
          description: 1,
          Class: 1,
          Guarantee: 1,
          mainCategorie: 1,
          manufacturingMaterial: 1,
         
       
      }, // only include offers that meet the specified conditions.
      { $skip: offset }, // skip the first "offset" documents.
      { $limit: 10 } // return "limit" documents after the skipped ones.
    ): await Product.find(
      { HomePage: true  },
     
  // filter to find the specific product by ID.
      {
      
        offers: {
          $elemMatch: {
            startDateOfOffers: { $lte: today },
            endDateOfOffers: { $gte: today },
            ActiveUser: true
          }
        },
          _id: 1,
          name: 1,
          mainImage: 1,
          description: 1,
          Class: 1,
          Guarantee: 1,
          mainCategorie: 1,
          manufacturingMaterial: 1,
    
        
      }, // only include offers that meet the specified conditions.
      { $skip: offset }, // skip the first "offset" documents.
      { $limit: 10 } // return "limit" documents after the skipped ones.
    );;
   
  }
  async getProductGallery(id) {
    return await Product.find({ _id: id }).select({ "gallery": 1 });
  }
  async  createOffer({ productsIds, endDateOfOffers, startDateOfOffers, valueOfOffer, typeOfOffer }) {
    const validTypesOfOffer = ['discount', 'percentage'];
    if (!validTypesOfOffer.includes(typeOfOffer)) {
      throw new Error(`Invalid type of offer: ${typeOfOffer}`);
    }
  
    const newOffer = {
      valueOfOffer: valueOfOffer,
      typeOfOffer: typeOfOffer,
      startDateOfOffers: new Date(startDateOfOffers),
      endDateOfOffers: new Date(endDateOfOffers), // expires in 7 days
    };
  
    const products = await Product.find({ _id: { $in: productsIds } });
    
    if (typeOfOffer === 'discount') {
      const invalidProduct = products.find((product) => {
        return product.Class.some((productClass) => {
          return valueOfOffer > productClass.price;
        });
      });
      if (invalidProduct) {
        throw new Error(`Discount value ${valueOfOffer} is greater than price `);
      }
    }
  
    const overlappingOffersProduct = await Product.findOne({
      _id: { $in: productsIds },
      'offers.endDateOfOffers': { $gte: newOffer.startDateOfOffers },
      'offers.startDateOfOffers': { $lte: newOffer.endDateOfOffers },
    });
    
    if (overlappingOffersProduct) {
      throw new Error(`There is an overlapping offer for product ${overlappingOffersProduct._id}`);
    }
  
    const updatePromises = products.map((product) => {
      return Product.updateOne(
        { _id: product._id },
        { $push: { offers: newOffer } }
      );
    });
  
    const updateResults = await Promise.all(updatePromises);
    return updateResults;
  }

  async updateOffer({ productId, offerId, endDateOfOffers, startDateOfOffers, valueOfOffer, typeOfOffer, ActiveUser }) {





    return await Product.findOneAndUpdate(
      { _id: productId, 'offers._id': offerId }, // filter to find the specific product and offer objects
      {
        $set: {
          'offers.$.valueOfOffer': valueOfOffer,
          'offers.$.typeOfOffer': typeOfOffer,
          'offers.$.ActiveUser': ActiveUser,
          'offers.$.startDateOfOffers': new Date(startDateOfOffers),
          'offers.$.endDateOfOffers': new Date(endDateOfOffers),
        }
      }, // update the fields in the matching offer object
      { new: true } // return the updated document
    )


  }

  async countTrends(owner_id) {
    return await Product.countDocuments({ isHotSeeling: true, owner_id: owner_id });
  }
  async getTrends(owner_id) {
    return await Product.find({ isHotSeeling: true, owner_id: owner_id });
  }
  async Search({name,color,price,mainCategorie,finished,manufacturingMaterial,offset,owner_id,HomePage}) {

    const query = Product.find();
     console.log(query);
    if (name) {
      query.where('name').regex(new RegExp(name, 'i'));
    }
    if (mainCategorie) {
      query.where('mainCategorie').equals(mainCategorie);
    }
    if (color) {
      query.where('Class.group.color').equals(color);
    }
    if (manufacturingMaterial) {
      query.where('manufacturingMaterial').equals(manufacturingMaterial);
    }
    if (finished) {
      query.where('Class.group.color').equals(0);
    }

    if (price) {
      const priceFilter = {};
  
        priceFilter.$lte = price;
     
  
      query.where('Class.price').equals(priceFilter);
    }
  
    if(owner_id){
      query.where('owner_id').equals(owner_id);
    }
    if(!owner_id){
      query.where('HomePage').equals(true);
    }
    const results = await query.skip(offset).limit(10).exec();
    
    return results;

}

async incrementQuantity({groupId,quantity}) {

  const product = await Product.findOne(
    { "Class.group._id": groupId },

  )
 
  product.Class.map((element) => {
    element.group.map((element) => {
   
     
      if (element._id.equals(groupId)) {
       
        element.quantity += quantity
      }
    })

  })

  return await product.save()
}

async decrementQuantity({groupId,quantity}) {

  const product = await Product.findOne(
    { "Class.group._id": groupId },

  )
 
  product.Class.map((element) => {
    element.group.map((element) => {
   
     
      if (element._id.equals(groupId)) {
       
        element.quantity -= quantity
      }
    })

  })

  return await product.save()
}


}



module.exports = new ProductRepositry();