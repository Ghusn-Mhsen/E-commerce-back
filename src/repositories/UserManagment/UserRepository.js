

const User = require('../../models/UserManagment/UserModel');
const ObjectId = require('mongoose').Types.ObjectId;
const BlackList = require('../../models/UserManagment/blackListSchema');

class UserRepository {

    async create({ fullName,phone, email,address, password ,marketName,marketLogo, iban, nameOFBank,nameOfBrand ,addressOfBank,businesslicense,role}) {
        var kycDoucoments={
            iban,
            nameOFBank,
            nameOfBrand,
            addressOfBank,
            businesslicense
        };
       
       
        await User.create({ fullName, email, password ,kycDoucoments,role,marketName,marketLogo,phone,address
        });
    }
    async createCustomer({  fullName, email, password ,role,address}) {
     
       
       
        await User.create({
            fullName, email, password ,address,role
        });
    }

    async findUser(query){
        return await User.findOne(query).select({"password":1,"role":1,"fullName":1,"email":1})
    }
    async findByUserName(name) {
        return await User.findOne({ fullName:name }).select({ password:0})
    }
    async findByUserEmail(email) {
        return await User.findOne({ email:email }).select({ password:0})
    }
   
    async getUsersWhereNot(userId) {
        return await User.find({ _id: { $ne: ObjectId(userId) } });
    }

    async getUserByID(myId) {
       
        return await User.findOne({
            _id: myId 
        }).select({ password:0});
    }
    
    async getUserByEmail(email) {
       
        return await User.findOne({
            email: email 
        }).select({ 'fullName': 1, 'email': 1, 'phone': 1,"location":1,"_id":1,"rate":1,"rate_info":1 ,});
    }
    async changePassword(email,newPassword){
       
         const user=await User.findOne({ email: email })
         user.password=newPassword
         console.log("jjjjjjjj");
         return await user.save()
    }

  
    async updateInfo(id,fullName,email,phone,marketLogo,marketName){
       return  await User.updateMany({ "_id": id }, { "$set": { "fullName": fullName, "email": email,"phone":phone,"marketName":marketName,"marketLogo":marketLogo}}, {new:true});
      
      

    }
    async blockToken(  token) {
   
        await BlackList.create({
             token
        });
    }

    async findByToken(token) {
        return await BlackList.findOne({ token });
    }     
    async getAllMerchants(offset){
       
        return await User.find({ role:2 } ).skip(offset).limit(10).select({marketName:1,marketLogo:1});
    }
    async getAllCustomers(offset){
        return await User.find({ role:3 } ).skip(offset).limit(10).select({role:0,rate:0,rate_info:0});
    }
    async getAllAdmins(offset){
        return await User.find({ role:1 } ).skip(offset).limit(10).select({role:0,rate:0,rate_info:0});
    }
  
   

}

module.exports = new UserRepository();