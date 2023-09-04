const jwt = require('jsonwebtoken');
const config = require('../../config/jwt');
const {checkCache}=require('../../utils/cache');
const UserRepository = require('../../repositories/UserManagment/UserRepository');

function checkAccess(role,path){
  
   role=parseInt(role)
 


    
    return ((role <=2 && path.includes('/user/Merchant/'))|| (role ==1 && path.includes('/user/Admin/'))||
   ((role == 3 || role == 1) && path.includes('/user/Customer') ) ||(path.includes('/user/allUsers/')));


}
module.exports = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
   
    const arrayAuth = authHeader.split(' ');
    if (arrayAuth.length != 2 || arrayAuth[0] != 'Bearer' ) return res.status(401).json({ error: 'The provided token is invalid' });
  
    const token = arrayAuth[1];
    req.bearerToken = token;
   const blocked= await UserRepository.findByToken(token)
   
   if(blocked){
    return res.status(401).json({ error: 'The provided token is invalid' })
   }
    jwt.verify(token, config.secret, (err, decoded) => {
     
       
        if (err){
            let error;
            switch(err.name){
                case 'TokenExpiredError':
                    error = 'Expired token';
                    break;
                default:
                    error = 'Invalid token';
                    break;
            }
            return res.status(400).json({
                error
            })
        }
        
       
        if(!(checkAccess(decoded.role,req.path))){
            return res.status(403).json({ error: "Non Authorized .." }) 
        }
       
        req.bearerToken = token;
        req.tokenInfo = decoded;
        req._id = decoded._id;
        req.role=decoded.role



        next();
    });


}
