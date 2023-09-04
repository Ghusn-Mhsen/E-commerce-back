const UserRepository = require("../../repositories/UserManagment/UserRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../utils/send_mail");
const validator = require("validator");

function generateJwtToken(user, role) {
  const { _id } = user;
  console.log(role);
  let payload = {
    _id: _id,
    role: role,
  };
  return jwt.sign(payload, "Shop_App_23/3/2023_M4G");
}

function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  return (Math.floor(Math.random() * (maxm - minm + 1)) + minm).toString();
}
const { getFromCache } = require("../../utils/cache");
class UserController {

   
   
    async signUpAsMerchant(req, res) {
      try {
            
         
        const role=req.role;
   
       
          const { fullName,marketName,phone, email, address,password , iban, nameOFBank,nameOfBrand ,addressOfBank,pin} = req.body;
          var { businesslicense,marketLogo } = req.files;
          businesslicense="MerchantDocuments\\"+businesslicense[0].filename;
          marketLogo="MerchantDocuments\\"+marketLogo[0].filename;
          if(!fullName ||!phone|| !marketName ||!marketLogo|| !address||!email||!password||!iban||!nameOFBank||!nameOfBrand||!addressOfBank||!pin){
           return res.json({
               message:"Your Data Isn't Complete",
           status:false,
          
         

              
           })
          }
      
          
          
          
         
           const user = {fullName,address,phone,email, password , iban, nameOFBank ,nameOfBrand,addressOfBank,role,businesslicense,marketName,marketLogo}
       
           const userExists = (await UserRepository.findByUserName(fullName));
         
           if (userExists) {
               return res.json({
                   message:"this user is already signed",
               status:false,
              
             
                  
               })
           }
           let pinFromCache=await getFromCache(email);
 
          if(pin.toString()!=pinFromCache){
           return res.json({
               message:"this pin is false or invalid",
           status:false,
          
         

              
           })
          }
           await UserRepository.create(user);
           const newUser = await UserRepository.findByUserEmail(req.body.email);
           const token = generateJwtToken(newUser,req.role);
           return res.json({
               message:"SignUp Successful ",
               status:true,
               data:{
                   user:newUser,
                   token:token,
                 
               }
               
           })

       } catch (err) {
        if (err instanceof TypeError && err.message.includes('undefined')) {
          console.log('No file uploaded');
          res.status(400).send('Please upload a file');
        } 
           return res.json({
               message:err.toString(),
               status:false,
             
           })
       }
  
  }
  async createCustomer(req, res) {
    try {
      const role = req.role;

      const { firstName, lastName, email, password, address, pin } = req.body;

      let pinFromCache = await getFromCache(email);
      
      if (pin.toString() != pinFromCache) {
        return res.json({
          message: "This Code Is Incorrect or Invalid Code",
          status: false,
        });
      }
      const fullName = `${firstName + lastName}`;
      var user;
      user = {
        fullName,
        email,
        password,
        role,
        address,
      };

      const userExists = await UserRepository.findByUserName(user.fullName);
      if (userExists) {
        return res.json({
          message: "This User Is Already Signed",
          status: false,
        });
      }
      await UserRepository.createCustomer(user);
      const newUser = await UserRepository.findByUserEmail(req.body.email);

      const token = generateJwtToken(newUser, req.role);
      return res.json({
        message: "SignUp Successful",
        status: true,
        data: {
          user: newUser,
          token: token,
        },
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err.toString(),
        status: false,
      });
    }
  }
  async login(req, res) {
    try {
 
    
        const { nameOrEmail, password  } = req.body;
       
        if (!nameOrEmail || !password) {
            return res.json({ status: false, message: "Your data isn't complete" })
        }
        const query={};
        (!validator.isEmail(req.body.nameOrEmail)) ?query.fullName=nameOrEmail:query.email=nameOrEmail
        
        const user = await UserRepository.findUser(query);

        if (!user ) {
            return res.json({
                message:"This User is not signed !!" ,
                status:false,
              
                 
                });
        }
       console.log(user);
        if (!await bcrypt.compare(password, user.password)) {
            return res.json({
                message:"Your Password is false !!",
                status:false,
            
                
                 });
        }
       
        const token = generateJwtToken(user,user.role);
      user.password=undefined
        return res.json({
            message:"Login Success",
            status:true,
        
            data:{
               user:user,
                token: token
            }
          
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message:err.toString(),
            status:false,
        
           
        })
    }
}

    async getProfile(req, res) {
        try {
            const myID = req._id;
        
           
           
           
            const user = await UserRepository.getUserByID(myID);
            if (!user) {
                return res.json({
                    message:"This User is not signed !!",
                    status:false,
                
                   
                    
                    });
            }
            
            
          
            return res.json({
                message:"getProfile Successful",
                status:true,
            
                data:{
                    user: user
                }
               
              ,
              
            });
        } catch (err) {
           
            return res.json({
                
                message: err.toString(),
                status: false,
              
            })
        }
    }
    
    async forgetPassword(req,res){
       
      try{  
        if(!validator.isEmail(req.body.email)){
            return res.json({
                message:"this email is invalid",
                status:false,
               
                
            }) 
        }
        var pin=generateRandomNumber();
       
        const email=req.body.email;
        
        await sendEmail({email,pin})
       
    
      res.status(200).send({
        message:"Check Your Email",
        status:true,
        pin:pin
       
    

       
      });}catch(err){
        console.log(err);
        return res.json({
            message:err.toString(),
            status:false,
           
            
        })  
      }
    }
    async updatePassword(req,res){
        try
           { 
        
            
            let pinFromCache = await getFromCache(req.body.email);
      if (req.body.pin.toString() != pinFromCache) {
        return res.json({
          message: "This Code Is Incorrect or Invalid Code",
          status: false,
        });
      }
            const temp= await UserRepository.changePassword(req.body.email,req.body.newPassword);
            if(!temp){
                return res.json({
                    message:"This email isn't signed",
                    status:false,
                   
                    
                })  
            }
            return res.json({
                message:"changePassword Successful",
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
    async updateProfile(req,res){

try{
    const { fullName, email,phone,marketName } = req.body;
    const myID = req._id; 
    var { marketLogo } = req.files;
    marketLogo=marketLogo[0].filename;
    const user= await UserRepository.updateInfo(myID,fullName,email,phone,marketLogo,marketName)
    
 
    console.log(user)
    return res.json({
        message:"updateProfile Successful",
        status:true,
    
        data:{
            user: user
        }
       
      ,
      
    });
}catch(err){
    console.log(err)
    return res.json({
              
        message:err.toString(),
        status: false,
      });
    }
  }
  async sendCodeToEmail(req, res) {
    try {
      if (!validator.isEmail(req.body.email)) {
        return res.json({
          message: "This Email IS Invalid",
          status: false,
        });
      }
      var pin = generateRandomNumber();
    

      await sendEmail({ email: req.body.email, pin: pin });

      res.status(200).send({
        message: "Check Your Email",
        status: true,
        pin:pin
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: 'ERROR In Send  Code To This Email ',
        status: false,
      });
    }
  }
 
  async updateCustomerProfile(req, res) {
    try {
      const { firstName, lastName, email, address } = req.body;
      const myID = req._id;
      const fullName = `${firstName + lastName}`

      const user = await UserRepository.updateInfo(
        myID,
        fullName,
        email,
        address
      );

     
      return res.json({
        message: "Update Customer Profile Successful",
        status: true,

        data: {
          user: user,
        },
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err.toString(),
        status: false,
      });
    }
  }
  async logout(req, res) {
    try {
      await UserRepository.blockToken(req.bearerToken);

      return res.json({
        message: "logout Successful",
        status: true,
      });
    } catch (err) {
      return res.json({
        message: err.toString(),
        status: false,
      });
    }
  }
  async getAllCustomers(req, res) {
    try {
      let limit = 10; // Number OF Post that Return in Every Request
      let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request
      const Customers = await UserRepository.getAllCustomers(offset);
      return res.json({
        message: "fetchAllCustomers Successful",
        status: true,

        data: {
          user: Customers,
        },
      });
    } catch (err) {
      return res.json({
        message: err.toString(),
        status: false,
      });
    }
  }
  async getAllMerchants(req, res) {
    try {
      let limit = 10; // Number OF Post that Return in Every Request
      let offset = 0 + (req.query.page - 1) * limit; // Get last Index that Get in previous Request
      const Merchants = await UserRepository.getAllMerchants(offset);
      return res.json({
        message: "fetchAllMerchants Successful",
        status: true,

        data: {
          user: Merchants,
        },
      });
    } catch (err) {
      return res.json({
        message: err.toString(),
        status: false,
      });
    }
  }

  async getUserInfo(req, res) {
    try {
      let id = req.params.id;
      const user = await UserRepository.getUserByID(id);
      return res.json({
        message: "fetchUser Successful",
        status: true,

        data: {
          user: user,
        },
      });
    } catch (err) {
      return res.json({
        message: err.toString(),
        status: false,
      });
    }
  }
}

module.exports = new UserController();
