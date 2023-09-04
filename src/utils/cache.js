
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const addToCache=async (key,value)=>{
   return await myCache.set( key, value , 60*30*1 )
  
};
const getFromCache=async ( key)=>{
    

 return await  myCache.get(key)    
  
   
};

module.exports={
    addToCache:addToCache,
    getFromCache:getFromCache
}
