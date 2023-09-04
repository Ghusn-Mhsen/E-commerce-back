
const OrderRepository = require("../../repositories/Order/Order");

class OrderController {


    async addOrder(req, res) {
        try {
            const user = req._id;
            const {userInfo} = req.body;
            const {shippingAddress} = req.body;
            const {paymentMethod} = req.body;

          

           
           const  order = await OrderRepository.addOrder({
            user,
            userInfo,
            shippingAddress,
            paymentMethod,
            });
           
            
            return res.json({
                message: "Add Order Successfully",
                status: true,
                data:order

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }
    }

    async getOrderById(req, res) {
        try {
            
            const {id} = req.params
           
           

            let order = await OrderRepository.getOrderById(id);

            return res.json({
                message: "Get User Order Successfully",
                status: true,
                data: order

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async getBestSellingProduct(req, res) {
        try {
         
            const {merchant_id} = req.query
            let order = await OrderRepository.getBestSellingProduct({merchant_id});

            return res.json({
                message: "Get Best Selling Product Successfully",
                status: true,
                data: order

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }
    async getOrdersByStatus(req, res) {
        try {
         
            const {merchant_id} = req.query
            let orders = await OrderRepository.getOrdersByStatus({merchant_id});

            return res.json({
                message: "Get Orders By Status Successfully",
                status: true,
                data: orders

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async getUserOrders(req, res) {
        try {
            

            const userID = req._id
           console.log(userID);

            let order = await OrderRepository.getUserOrders(userID);

            return res.json({
                message: "Get User Orders Successfully",
                status: true,
                data: order

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async getAllOrders(req, res) {
        try {
        
            let orders = await OrderRepository.getAllOrders();

            return res.json({
                message: "Get All Orders Successfully",
                status: true,
                data: orders

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }
    async getTotalRevenue(req, res) {
        try {
        
            let orders = await OrderRepository.getTotalRevenue();

            return res.json({
                message: "Get Total Revenue Successfully",
                status: true,
                data: orders

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }
    async getTotalRevenueForEachMerchant(req, res) {
        try {
        
            let orders = await OrderRepository.getTotalRevenueForEachMerchant();

            return res.json({
                message: "Get Total Revenue Successfully",
                status: true,
                data: orders

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }
    async getTotalQuantitySold(req, res) {
        try {
        
            let productSold = await OrderRepository.getTotalQuantitySold();

            return res.json({
                message: "Get Total Quantity Sold Successfully",
                status: true,
                data: productSold

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }

    async getTotalQuantitySoldForEachMerchant(req, res) {
        try {
        
            let productSold = await OrderRepository.getTotalQuantitySoldForEachMerchant();

            return res.json({
                message: "Get Total Quantity Sold Successfully",
                status: true,
                data: productSold

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }
    async getAverageOrderValue(req, res) {
        try {
        
            let value = await OrderRepository.getAverageOrderValue();

            return res.json({
                message: "Get Average Order Value Successfully",
                status: true,
                data: value

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }

    async getAverageOrderValueForEachMerchant(req, res) {
        try {
        
            let value = await OrderRepository.getAverageOrderValueForEachMerchant();

            return res.json({
                message: "Get Average Order Value Successfully",
                status: true,
                data: value

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }
    async getSalesByDate(req, res) {
        try {
        
            let sales = await OrderRepository.getSalesByDate();

            return res.json({
                message: "Get Sales By Date Successfully",
                status: true,
                data: sales

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }
    async getSalesByDateForEachMerchant(req, res) {
        try {
        
            let sales = await OrderRepository.getSalesByMonthForEachMerchant();

            return res.json({
                message: "Get Sales By Date Successfully",
                status: true,
                data: sales

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }
    async getSalesByProductCategory(req, res) {
        try {
        
            let Categories = await OrderRepository.getSalesByProductCategory();

            return res.json({
                message: "Get Sales By Product Category Successfully",
                status: true,
                data: Categories

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }
    async getAverageOrderProcessingTime(req, res) {
        try {
        
            let averageTime = await OrderRepository.getAverageOrderProcessingTime();

            return res.json({
                message: "Get Average Order Processing Time Successfully",
                status: true,
                data: averageTime
            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }



    }

   

    async getProductWithQuantity(req, res) {
        try {
            

            const {merchant_id} = req.query
           

            let products = await OrderRepository.getProductWithQuantity(merchant_id);

            return res.json({
                message: "Get Products with  quantity Sold Successfully",
                status: true,
                data: products

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }
    async getOrdersForMerchant(req, res) {
        try {
            

            const {merchant_id} = req.query
           

            let orders = await OrderRepository.getOrdersForMerchant(merchant_id);

            return res.json({
                message: "Get Orders Merchant Successfully",
                status: true,
                data: orders

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async getOrderForMerchantById(req, res) {
        try {
            

            const {orderID,merchantId} = req.query
           

            let order = await OrderRepository.getOrderForMerchantById(orderID,merchantId);

            return res.json({
                message: "GetOrder For Merchant By Id Successfully",
                status: true,
                data: order

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async getMerchantUsers(req, res) {
        try {
            

            const {merchantId} = req.query
           

            let users = await OrderRepository.getMerchantUsers(merchantId);

            return res.json({
                message: "get Merchant Users Successfully",
                status: true,
                data: users

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async ChangeOrderStatus(req, res) {
        try {

            const {id,status} = req.body
            let order = await OrderRepository.ChangeOrderStatus({id,status});

            return res.json({
                message: "Change Order Status Successfully",
                status: true,
                data: order

            })

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }


    }

    async advancedSearch(req, res) {
        try {
          let limit = 10; // Number OF Post that Return in Every Request
    
          let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request
         
          const {merchant_id, firstName, lastName, email, phone, status, totalPrice, country,city,region,streetNumber,houseNumber,shippingDate,paymentMethod,paymentStatus } = req.query;
          const orders = await OrderRepository.advancedSearch( { offset,merchant_id,firstName, lastName, email, phone, status, totalPrice, country,city,region,streetNumber,houseNumber,shippingDate,paymentMethod,paymentStatus });
               
          return res.json({
            message: "search Successfully",
            status: true,
            data: orders,
          });
        } catch (err) {
          console.log(err);
          return res.json({
            message: err,
            status: false,
          });
        }
      }

   
   

}
module.exports = new OrderController();