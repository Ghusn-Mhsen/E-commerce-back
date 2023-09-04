const Banner = require('../../models/banner/banner');
const mongoose = require('mongoose');

class BannerRepositry {

  async createBanner(banner) {

    //console.log(banner);
     const banners=await Banner.insertMany(banner);
    // console.log(banners);
     return banners
  }




  async getBanners() {


    console.log(new Date());
    return await Banner.find( { endDate: { $gte: new Date() }} )
  }
 
  async delete(_id){
    return await Banner.findByIdAndDelete(_id)

   

  }

}



module.exports = new BannerRepositry();