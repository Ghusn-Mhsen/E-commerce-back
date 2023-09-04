module.exports=(req,res,next)=>{
  
  
  const path=req.path;
    if(path.includes('/user/Merchant'))
    {
   
    req.role= 2;
    
    }
    if(path.includes('/user/Customer'))
   { 
 
    req.role= 3;
  }
     if(path.includes('/user/Admin'))
     {
     
    req.role= 1;
  }
  console.log(req.role);
  
     next();

}