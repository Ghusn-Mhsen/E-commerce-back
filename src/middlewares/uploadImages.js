const multer = require('multer');
const path = require('path');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const dir =__dirname.split('\\').slice(0,-1).join('\\').toString();
const maxSize = 100 * 1024 * 1024;

const generateFileName = (file) => {
  const filename = `${Date.now()}-${uuidv4()}.${file.mimetype.split('/')[1]}`;
  return filename;
};

const createUploadMiddleware = (destination) => {
    
  return multer({
    storage: multer.diskStorage({
      destination: path.join(dir, `../public/${destination}`),
      filename: (req, file, cb) => {
        cb(null, generateFileName(file));
      }
    }),
    limits: {
      fileSize: maxSize,
    },
  });
};

const uploadKyc = createUploadMiddleware('MerchantDocuments').fields([{ name: 'businesslicense', maxcount: 1 }, { name: 'marketLogo', maxcount: 1 }]);
const uploadProductFiles = createUploadMiddleware('uploads/images').fields([{ name: 'mainImage', maxCount: 1 }, { name: 'gallery', maxCount: 3 }]);
const uploadProductVideo = createUploadMiddleware('uploads/Videos').fields([{ name: 'mainVideo', maxcount: 1 }]);
const uploadProductVr = createUploadMiddleware('uploads/3D').single('vrImage');
const uploadProductAr = createUploadMiddleware('uploads/3D').fields([{ name: 'arImage', maxcount: 1 }]);
const uploadDispute = createUploadMiddleware('Dispute').fields([{ name: 'disputeImage', maxcount: 1 }]);
const uploadCategorieImage = createUploadMiddleware('Categorie').fields([{ name: 'ImageOfCate', maxcount: 1 }]);

const uploadBanner=createUploadMiddleware('Banner').array('content');
const uploadFeature = createUploadMiddleware('Features').fields([{ name: 'icon', maxcount: 1 }]);

module.exports = {
  uploadKyc: util.promisify(uploadKyc),
  uploadProductFiles: util.promisify(uploadProductFiles),
  uploadCategorieImage: util.promisify(uploadCategorieImage),
  uploadBanner: util.promisify(uploadBanner),
  uploadProductVideo: util.promisify(uploadProductVideo),
  uploadProductAr: util.promisify(uploadProductAr),
  uploadProductVr: util.promisify(uploadProductVr),
  uploadDispute: util.promisify(uploadDispute),
  uploadFeature: util.promisify(uploadFeature),
};