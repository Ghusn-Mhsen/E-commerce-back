const mongoose =require ('mongoose');
const HotSelling = require("../../models/ProductManagment/HotSelling");

class HotSellsRepositry {


    async addToTrend({ product_id, influncer_id, HomeTrend ,ToHomeTrend,endDate}) {


        return await HotSelling.create({
            product_id, influncer_id, HomeTrend,ToHomeTrend,endDate
        });
    }
    async removeFromTrend({ _id }) {

        return await HotSelling.findOneAndRemove(
            { product_id: _id }
        );
    }
    async getHotSelling({ influncer_id }) {
        const today = new Date();
    
        const matchStage = {
            endDate: { $gte: new Date() }
        };
    
        const lookupStage = {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product"
        };
    
        const unwindStage = { $unwind: "$product" };
    
        const filterOffers = {
            $filter: {
                input: '$offers',
                as: 'offer',
                cond: {
                    $and: [
                        { $lte: ['$$offer.startDateOfOffers', today] },
                        { $gte: ['$$offer.endDateOfOffers', today] },
                        { $eq: ['$$offer.Active', true] }
                    ]
                }
            }
        };
    
        const projectStage = {
            "product._id": 1,
            "product.mainImage": 1,
            "product.Class": 1,
            "product.name": 1,
            "product.descreption": 1,
            "product.mainCategorie": 1,
            "product.manufacturingMaterial": 1,
            "product.descreption": 1,
            "product.Guarantee":1,
            "product.offers": 1
        };
    
        let products;
    
        if (influncer_id != null) {
            products = await HotSelling.aggregate([
                { $match: { influncer_id: new mongoose.Types.ObjectId(influncer_id) } },
                { $match: matchStage },
                { $lookup: lookupStage },
                unwindStage,
                {
                    $project: {
                        offers: filterOffers,
                        ...projectStage
                    }
                }
            ]);
        } else {
            products = await HotSelling.aggregate([
                { $match: { HomeTrend: true } },
                { $match: matchStage },
                { $lookup: lookupStage },
                unwindStage,
                {
                    $project: {
                        offers: filterOffers,
                        ...projectStage
                    }
                }
            ]);
        }
    
        return products;
    }
    
    
    async getHotSellingToBeInHomeTrend() {
        

      const today=new Date() 
       return await HotSelling.aggregate([
        {
            $match: {
            ToHomeTrend:true,
            HomeTrend:false,
            endDate: { $gte: today }
        }
       },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" }
           ,
           
            {
                $project: {
                    product: "$product",
             
                    offers: {
                        $filter: {
                            input: '$offers', as: 'offer',
                            cond: { $and: [{ $lte: ['$$offer.startDateOfOffers', today] }, { $gte: ['$$offer.endDateOfOffers', today] }, { $eq: ['$$offer.Active', true] }] }
                        }
                    },
                  

                }
            }, // only include offers that meet the specified conditions   

        ])

      
     
    }
    async addingToHomeTrend(id){

        const temp= await HotSelling.findOne({product_id:id})
        console.log(temp);
         temp.HomeTrend=true
         temp.ToHomeTrend=false
         
         return await temp.save();
    }
    async removeFromHomeTrend(){
        const temp= await HotSelling.findById(id)
        temp.HomeTrend=false
        temp.ToHomeTrend=false
        return await temp.save();
    }
}
module.exports = new HotSellsRepositry();