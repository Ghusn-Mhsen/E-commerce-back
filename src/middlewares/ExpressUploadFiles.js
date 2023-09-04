// middleware function
const uploadImage = (req, res, next) => {
    if (!req.files || !req.files.mainImage /*|| !req.files.gallery*/) {
      return res.status(400).send('No image uploaded.');
    }
  
    const image = req.files.mainImage;
   // const gallery=req.files.gallery;
    
    // التأكد من أن الملف المرفوع هو صورة
    if (!image.mimetype.startsWith('image/')) {
      return res.status(400).send('File is not an image.');
    }
  
    // حفظ الصورة على القرص الثابت
    image.mv(__dirname + 'public/uploads/images' + image.name, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      req.imagePath = __dirname + 'public/uploads/images' + image.name;
      next();
    });
  };

  module.exports={
    uploadProductImage:uploadImage
  }