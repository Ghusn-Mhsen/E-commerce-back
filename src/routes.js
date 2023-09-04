
const express = require('express');
const router = express.Router();



const userController = require('./controllers/UserManagment/UserController');

 const {uploadKyc,uploadProductFiles,uploadDispute,uploadCategorieImage,uploadBanner,uploadProductVideo,uploadProductAr,uploadProductVr,uploadFeature} = require('./middlewares/uploadImages');
const authMiddleWare = require('./middlewares/auths/user');
const detectRole = require('./middlewares/auths/detectRole');
const ProductController = require('./controllers/ProductManagment/ProductController');
const DisputeController = require('./controllers/Dispute/dispute');
const SequenceController = require('./controllers/Sequence/Sequence');

const FeatureController = require('./controllers/SiteFeatures/SiteFeatures');
const DeviceTokenController = require('./controllers/DeviceToken/DeviceToken');
const TopicController = require('./controllers/Topic/Topic');
const PaymentController = require('./controllers/Payment/PayPal');
const WishListController = require('./controllers/wishList/wishList');
const CartController = require('./controllers/Cart/Cart');
const notificationsController = require('./controllers/Notifications/notifications');
const OrderController = require('./controllers/Order/order');
const OffersController = require('./controllers/OffersManagment/OffersController');

const checkQuantity=require('./middlewares/Product/checkQuantity')
const CheckOperationsOnCart=require('./middlewares/Cart/CheckOperationsOnCart')
const checkOrderQuantity=require('./middlewares/Order/checkOrderQuantity')

const HotSellsController = require('./controllers/HotSells/HotSellsController');
const categorieController = require('./controllers/Categorie/categorieController');
const BannerController = require('./controllers/Banners/BannerController');

const recommendedProductsController = require('./controllers/Rec-Sys/recommendedProductsController');


const dir = require("./config/path");
const Web3ControllerJs = require('./controllers/Web3Controller/web3Controller.Js');


const download =async (req, res) => {
    const fileName = req.query.fileName;
    console.log(dir.PATH);
    
   await res.download(dir.PATH + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                status: false,
                message: "Could not download the file. " + err,
            });
        }
    });
}


//Registeration
router.post('/user/Merchant/SignUp',uploadKyc,detectRole, userController.signUpAsMerchant);
router.post('/user/Admin/SignUp',uploadKyc,detectRole, userController.signUpAsMerchant);
router.post('/user/Customer/SignUp',detectRole, userController.createCustomer);

//login
router.post('/user/Merchant/auth',  userController.login);
router.post('/user/Customer/auth',  userController.login);
router.post('/user/Admin/auth', userController.login);


//change password
router.put('/user/Merchant/updatePassword', userController.updatePassword);
router.put('/user/Customer/updatePassword', userController.updatePassword);
router.put('/user/Admin/updatePassword', userController.updatePassword);


//forget password  // ** Send Code To Email
router.post('/user/sendCodeToEmail', userController.forgetPassword);
router.post('/user/sendCodeToCustomerEmail', userController.sendCodeToEmail);

//get profile
router.get('/user/Merchant/getProfile', authMiddleWare, userController.getProfile);
router.get('/user/Customer/getProfile',authMiddleWare, userController.getProfile);
router.get('/user/Admin/getProfile', authMiddleWare, userController.getProfile);


//updateProfile
router.put('/user/Merchant/updateProfile', authMiddleWare,uploadKyc, userController.updateProfile);
router.put('/user/Admin/updateProfile', authMiddleWare,uploadKyc, userController.updateProfile);
router.put('/user/Customer/updateProfile', authMiddleWare, userController.updateCustomerProfile);




//getUsers
router.get('/user/allUsers/getAllMerchants/', userController.getAllMerchants);
router.get('/user/Admin/getAllCustomers', userController.getAllCustomers);
router.get('/user/Merchant/getAllCustomers', userController.getAllCustomers);


router.get('/user/allUsers/getUserInfo/:id', authMiddleWare, userController.getUserInfo);


//logout
router.get('/user/allUsers/logout', authMiddleWare, userController.logout);



//Product Creation And Update
router.post('/user/Merchant/addProduct',authMiddleWare, ProductController.createProduct);
router.post('/user/Merchant/addImagesProduct/:id',uploadProductFiles,authMiddleWare, ProductController.addImagesToProduct);
router.post('/user/Merchant/addVrImageProduct/:id',uploadProductVr,authMiddleWare, ProductController.addVRToProduct);
router.post('/user/Merchant/addArImageProduct/:id',uploadProductAr,authMiddleWare, ProductController.addARToProduct);
router.post('/user/Merchant/addDeliveryAreasToProduct/:id',authMiddleWare, ProductController.addDeliveryAreasToProduct);
router.post('/user/Merchant/addVideoProduct/:id',uploadProductVideo,authMiddleWare, ProductController.addVideoToProduct);
router.post('/user/Merchant/updateProductInfo/:id',authMiddleWare, ProductController.updateProductInfo);
router.post('/user/Merchant/updateClassInProductInfo/:id',authMiddleWare, ProductController.updateClassInProductInfo);
router.post('/user/Merchant/updateGroupInClassInProductInfo/:id',authMiddleWare, ProductController.updateGroupInClassInProductInfo);




// Dispute 

router.post('/user/allUsers/addDispute',uploadDispute,DisputeController.addDispute)
router.get('/user/Merchant/getDispute/:id', authMiddleWare,DisputeController.getDispute)
router.delete('/user/Merchant/deleteDispute/:id', authMiddleWare,DisputeController.deleteDispute)
router.get('/user/Merchant/searchForDispute/', authMiddleWare,DisputeController.searchForDispute)
router.put('/user/Merchant/processDispute/:id', authMiddleWare,DisputeController.processDispute)
router.put('/user/Merchant/resolveDispute/:id', authMiddleWare,DisputeController.resolveDispute)
router.get('/user/Merchant/getAllDispute', authMiddleWare,DisputeController.getAllDispute)
router.get('/user/Merchant/advancedSearchDispute', DisputeController.advancedSearch);
router.post('/user/allUsers/addComment/:id',authMiddleWare, DisputeController.addComment);
router.get('/user/allUsers/getDisputesByEmail/',authMiddleWare, DisputeController.getDisputesByEmail);



// Sequence

router.post('/user/Admin/sequence',authMiddleWare, SequenceController.addSequence);


// SiteFeatures

router.post('/user/Admin/addFeature',uploadFeature,FeatureController.addFeature)
router.get('/user/Customer/getFeature/:id', authMiddleWare,FeatureController.getFeature)
router.delete('/user/Admin/deleteFeature/:id', authMiddleWare,FeatureController.deleteFeature)
router.get('/user/Customer/getAllFeature', authMiddleWare,FeatureController.getAllFeatures)



// wishList
router.post('/user/Customer/addToWishList', authMiddleWare,WishListController.addProduct)
router.post('/user/Customer/removeToWishList', authMiddleWare,WishListController.removeProduct)
router.get('/user/Customer/getWishListByUserID', authMiddleWare,WishListController.getWishListByUserID)
router.delete('/user/Customer/deleteWishListByUserID', authMiddleWare,WishListController.deleteWishListByUserID)


// Cart 
router.post('/user/Customer/addToCart', authMiddleWare,checkQuantity,CartController.addToCart)
router.post('/user/Customer/decrementItemOnCart', authMiddleWare,checkQuantity,CheckOperationsOnCart,CartController.decrementItemOnCart)
router.post('/user/Customer/deleteProductFromCart', authMiddleWare,CartController.deleteProductFromCart)
router.post('/user/Customer/deleteUserCartByID', authMiddleWare,CartController.deleteUserCartByID)
router.get('/user/Customer/getUserCart', authMiddleWare,CartController.getUserCart)

// Order 
router.post('/user/Customer/addOrder', authMiddleWare,checkOrderQuantity,OrderController.addOrder)
router.get('/user/allUsers/getOrderById/:id', authMiddleWare,OrderController.getOrderById)
router.get('/user/allUsers/getUserOrders', authMiddleWare,OrderController.getUserOrders)
router.get('/user/Merchant/getProductWithQuantity',authMiddleWare,OrderController.getProductWithQuantity)
router.get('/user/Merchant/getOrdersForMerchant',authMiddleWare,OrderController.getOrdersForMerchant)
router.get('/user/Merchant/getOrderForMerchantById',authMiddleWare,OrderController.getOrderForMerchantById)
router.put('/user/allUsers/ChangeOrderStatus', authMiddleWare,OrderController.ChangeOrderStatus)
router.get('/user/Admin/getAllOrders', authMiddleWare,OrderController.getAllOrders)
router.get('/user/Merchant/getMerchantUsers', authMiddleWare,OrderController.getMerchantUsers)
router.get('/user/allUsers/advancedSearch', authMiddleWare,OrderController.advancedSearch)

//*** Order Statistics
router.get('/user/Merchant/getOrdersByStatus', authMiddleWare,OrderController.getOrdersByStatus)
router.get('/user/Customer/getBestSellingProduct', authMiddleWare,OrderController.getBestSellingProduct)
router.get('/user/Admin/getTotalRevenue', authMiddleWare,OrderController.getTotalRevenue)
router.get('/user/Admin/getTotalRevenueMerchant', authMiddleWare,OrderController.getTotalRevenueForEachMerchant)
router.get('/user/Admin/getTotalQuantitySold', authMiddleWare,OrderController.getTotalQuantitySold)
router.get('/user/Admin/getTotalQuantitySoldMerchant', authMiddleWare,OrderController.getTotalQuantitySoldForEachMerchant)
router.get('/user/Admin/getAverageOrderValue', authMiddleWare,OrderController.getAverageOrderValue)
router.get('/user/Admin/getAverageOrderValueMerchant', authMiddleWare,OrderController.getAverageOrderValueForEachMerchant)
router.get('/user/Admin/getSalesByDate', authMiddleWare,OrderController.getSalesByDate)
router.get('/user/Admin/getSalesByDateMerchant', authMiddleWare,OrderController.getSalesByDateForEachMerchant)
router.get('/user/Admin/getSalesByProductCategory', authMiddleWare,OrderController.getSalesByProductCategory)
router.get('/user/Admin/getAverageOrderProcessingTime', authMiddleWare,OrderController.getAverageOrderProcessingTime)



// PayPal 
router.get('/user/Customer/pay',PaymentController.create)
router.get('/user/Customer/paypal/success',PaymentController.success)
router.get('/user/Customer/paypal/Cancel',PaymentController.Cancel)
router.get('/user/Admin/payment/:id', authMiddleWare,PaymentController.getPayPalPaymentByID)
router.delete('/user/Admin/deletePayment/:id', authMiddleWare,PaymentController.deletePayPalPaymentByID)
router.get('/user/Admin/getAllPayment', authMiddleWare,PaymentController.getAllPayPalPayment)


// Device Tokens
router.post('/user/allUsers/addDeviceTokens',authMiddleWare,DeviceTokenController.addDeviceToken)
router.get('/user/allUsers/getDeviceTokenByID/:id', authMiddleWare,DeviceTokenController.getDeviceTokenByID)
router.get('/user/allUsers/getDeviceTokenByUserID/:id', authMiddleWare,DeviceTokenController.getDeviceTokenByUserID)
router.delete('/user/Admin/deleteDeviceToken/:id', authMiddleWare,DeviceTokenController.deleteDeviceToken)
router.delete('/user/Admin/deleteDeviceTokenByUserId/:id', authMiddleWare,DeviceTokenController.deleteDeviceTokenByUserId)
router.get('/user/Admin/getAllDeviceToken', authMiddleWare,DeviceTokenController.getAllDeviceToken)

// Topics
router.post('/user/Admin/addTopic',authMiddleWare,TopicController.addTopic)
router.get('/user/Admin/getTopicByID/:id', authMiddleWare,TopicController.getTopicByID)
router.delete('/user/Admin/deleteTopic/:id', authMiddleWare,TopicController.deleteTopic)
router.get('/user/Admin/getAllTopics', authMiddleWare,TopicController.getAllTopics)

// Notifications 
/*
router.post('/user/allUsers/sendPushNotification',authMiddleWare,notificationsController.sendPushNotification)
router.post('/user/Admin/sendTopicNotification',authMiddleWare,notificationsController.sendTopicNotification)
*/


//Fetch Products
//singleProduct
router.get('/user/allUsers/Product/:id', ProductController.getProductByID);
router.get('/user/allUsers/GalleryProduct/:id', ProductController.getGalleryOfProductByID);
router.get('/user/allUsers/getProduct/:id', ProductController.getProduct);

//listProduct
router.get('/user/allUsers/MerchantProducts/:id', ProductController.getMerchantProducts);

router.get('/user/allUsers/CategorieProducts/:cate', ProductController.getCategorieProducts);


//Offers
router.post('/user/Merchant/addOffer', OffersController.createOffer);
router.get('/user/allUsers/getOffers', OffersController.getMerchantActiveoffers);
router.get('/user/Merchant/OffersProduct/:id',authMiddleWare, OffersController.getoffersByProductId);
router.post('/user/Merchant/updateOfferInfo/:id',authMiddleWare, OffersController.updateOfferInfo);


router.post('/user/allUsers/SearchProduct', ProductController.search);

//Hot Selling
router.post('/user/Merchant/addToHotSelling/:id',authMiddleWare, HotSellsController.addToHotSelling);
router.post('/user/Merchant/removeFromHotSelling/:id',authMiddleWare, HotSellsController.removeFromHotSelling);
router.get('/user/allUsers/getHotSelling', HotSellsController.getHotSelling);
router.get('/user/Admin/getProductsToBeHomeTrend', HotSellsController.getHotSellingToBeHotTrend);
router.get('/user/Admin/acceptHotSellsInHomeTrend/:id', HotSellsController.acceptInHomeTrend);

//Categorie
router.post('/user/Merchant/addingCategorie',authMiddleWare,uploadCategorieImage, categorieController.createCategorie);
router.post('/user/Merchant/updateCategorie/:id',authMiddleWare, uploadCategorieImage,categorieController.updateCategorie);
router.get('/user/allUsers/getCategorie', categorieController.getCategories);
router.delete('/user/Merchant/deleteCategorie/:id',authMiddleWare, categorieController.deleteCategorie);



//Banners
router.post('/user/Admin/addToBanner',uploadBanner,authMiddleWare, BannerController.createBanner);
router.get('/user/allUser/getBanners', BannerController.getBanners);
router.delete('/user/Admin/deleteFromBanner/:id',authMiddleWare, BannerController.deleteBanner);






//downloadImages
router.get('/api/download',download)


// Recommend products to a user using collaborative filtering
router.get('/user/allUsers/recommendations',authMiddleWare ,recommendedProductsController.getRecommendedProductsWithoutML)
router.get('/user/allUsers/recommendationsMl',authMiddleWare ,recommendedProductsController.getRecommendedProductsWithML)

router.get('/user/allUsers/getMyBalance',authMiddleWare,async(req,res)=>{
 try
 {


    const balance= await Web3ControllerJs.getLoyaltyPoints(req._id)
   res.status(200).json({
    status:true,
    data:balance
   })
}catch(err){
    res.status(500).json({
        status:false,
        err:err.toString()
       }) 
}
})


/* test this Apis + improve the model Rec */
router.get('/user/allUsers/getUserProductsHistory/:id',authMiddleWare,async(req,res)=>{
    try
    {
     
        const productId=req.params.id;
        const orderId=req.query.order;
     
       
       const products= await Web3ControllerJs.getProductHistory(req._id,productId,orderId)
      res.status(200).json({
       status:true,
       data:products
      })
   }catch(err){
       res.status(500).json({
           status:false,
           err:err.toString()
          }) 
   }
   })
router.get('/user/allUsers/getUserPointsHistory',authMiddleWare,async(req,res)=>{
    try
    {
     
      const products= await Web3ControllerJs.getPointsTransactionHistory(req._id)
      res.status(200).json({
       status:true,
       data:products
      })
   }catch(err){
       res.status(500).json({
           status:false,
           err:err.toString()
          }) 
   }
   })   


module.exports = router;