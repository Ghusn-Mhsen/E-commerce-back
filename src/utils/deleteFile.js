const fs = require('fs');

module.exports=  function({path}){
  console.log("kkkkk");
    console.log(path);
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      
        console.log('File deleted successfully');
      });
}