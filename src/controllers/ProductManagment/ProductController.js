
const ProductRepositry = require("../../repositories/ProductManagment/ProductRepositry");
const { PATH } = require("../../config/path");
const deleteFile = require("../..//utils/deleteFile");

function addOfferToProduct(product) {
    if (product.offers[0]) {
        //   console.log("iamUnderOffer");
        const valOfDiscount = product.offers[0].valueOfOffer;
        for (let index = 0; index < product.Class.length; index++) {
            const element = product.Class[index];
            product.Class[index].priceAfterDiscount = (product.offers[0].typeOfOffer == "discount") ? element.price - valOfDiscount : element.price - element.price * (valOfDiscount / 100);
            //   console.log(element.priceAfterDiscount);
        }
        product.offers = undefined

    }
    //console.log(product);
    return product
}
class ProductController {



    async createProduct(req, res) {
        try {
            const owner_id = req._id;
            const HomePage = (req.role == 1)
            const { name, descreption, mainCategorie, manufacturingMaterial, Guarantee, Class } = req.body;


            if (!name || !manufacturingMaterial || !Guarantee || !descreption || !mainCategorie) {
                return res.json({

                    message: "your data isn't complete !!",
                    status: false,

                })
            }


            const product = await ProductRepositry.create({ name, descreption, mainCategorie, manufacturingMaterial, Guarantee, Class, owner_id, HomePage });


            return res.json({
                message: "Creating Product Successfully",
                status: true,
                data: {
                    product: product
                }

            })

        }
        catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }
    }
    async addImagesToProduct(req, res) {
        try {
            const id = req.params.id;
        
            const { mainImage, gallery } = req.files;
            if (!mainImage || !gallery) {
              return res.json({
                message: "Your data isn't complete!",
                status: false,
              });
            }
        
            const mainImagePath = "uploads/images/" + mainImage[0].filename;
            const galleryImages = gallery.map((file) => {
              return "uploads/images/" + file.filename;
            });
        
            const product = await ProductRepositry.addImagesToProd({ id, mainImage: mainImagePath, gallery: galleryImages });
        
            return res.json({
              message: "Adding images to product successfully",
              status: true,
              data: {
                product: product
              }
            });

        } catch (err) {
         
            if (err instanceof TypeError && err.message.includes('undefined')) {
                console.log('No file uploaded');
                res.status(400).send('Please upload a file');
              } 
            return res.json({
                message: err.toString() || 'Error adding images to product',
                status: false,
            });
        }

    }
    async addVideoToProduct(req, res) {
        try {

            const id = req.params.id;

            var { mainVideo } = req.files;
            if (!mainVideo) {
                return res.json({

                    message: "your data isn't complete !!",
                    status: false,

                })
            }
            console.log(mainVideo);
            // console.log(mainVideo[0].filename);
            mainVideo = "uploads\\Videos\\" + mainVideo[0].filename;



            const product = await ProductRepositry.addVideoToProd({ id, mainVideo });


            return res.json({
                message: "adding Video To Product Successfully",
                status: true,
                data: {
                    product: product
                }

            })

        }
        catch (err) {
            if (err instanceof TypeError && err.message.includes('undefined')) {
                console.log('No file uploaded');
                res.status(400).send('Please upload a file');
              } 
            return res.json({
                message: err.toString(),
                status: false,

            })
        }
    }
    async  addVRToProduct(req, res) {
        try {
          const id = req.params.id;
          if (!req.file) {
            return res.json({
              message: "Your data isn't complete!",
              status: false,
            });
          }
          let { vrImage } = req.file;
         
          vrImage = "uploads\\3D\\" + req.file.filename;
    
          const product = await ProductRepositry.addVRToProd({ id, vrImage });
          return res.json({
            message: "Adding VR to product successfully",
            status: true,
            data: {
              product: product,
            },
          });
        } catch (err) {
          console.log(err);
          if (err instanceof TypeError && err.message.includes("undefined")) {
            console.log("No file uploaded");
            res.status(400).send("Please upload a file");
          }
          return res.json({
            message: err.toString(),
            status: false,
          });
        }
      }
    async addARToProduct(req, res) {
        try {

            const id = req.params.id;

            var { arImage } = req.files;
            if (!arImage) {
                return res.json({

                    message: "your data isn't complete !!",
                    status: false,

                })
            }
            arImage = "uploads\\3D\\" + arImage[0].filename;



            const product = await ProductRepositry.addARToProd({ id, arImage });


            return res.json({
                message: "adding AR To Product Successfully",
                status: true,
                data: {
                    product: product
                }

            })

        }
        catch (err) {
            if (err instanceof TypeError && err.message.includes('undefined')) {
                console.log('No file uploaded');
                res.status(400).send('Please upload a file');
              } 
            return res.json({
                message: err.toString(),
                status: false,

            })
        }
    }
    async addDeliveryAreasToProduct(req, res) {
        try {

            const id = req.params.id;

            var { areas } = req.body;
            if (!areas) {
                return res.json({

                    message: "your data isn't complete !!",
                    status: false,

                })
            }




            const product = await ProductRepositry.addDeliveryAreas({ id, areas });


            return res.json({
                message: "adding delivery Areas To Product Successfully",
                status: true,
                data: {
                    product: product
                }

            })

        }
        catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,

            })
        }
    }

    async updateProductInfo(req, res) {
        try {
            const { name, descreption, mainCategorie, manufacturingMaterial, Guarantee } = req.body;


            const id = req.params.id;


            const newproduct = await ProductRepositry.updateProductInfo({ id, name, descreption, mainCategorie, manufacturingMaterial, Guarantee })

            if (newproduct) {
                return res.json({
                    message: "update Info of Product Successfully",
                    status: true,
                    data: {
                        product: newproduct
                    }

                })
            }

        } catch (err) {
            console.log(err);
            return res.json({
                message: err,
                status: false,

            })
        }

    }

    async updateClassInProductInfo(req, res) {
        try {
            const { price, size, length, width, sallableInPoints } = req.body;

            const id = req.params.id;


            const newproduct = await ProductRepositry.updateClassInProductInfo({ id, price, size, length, width, sallableInPoints })

            if (newproduct) {
                return res.json({
                    message: "update Info of Product Successfully",
                    status: true,
                    data: {
                        product: newproduct
                    }

                })
            }

        } catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,

            })
        }

    }
    async updateGroupInClassInProductInfo(req, res) {
        try {
            const { color, quantity } = req.body;

            const id = req.params.id;


            const newproduct = await ProductRepositry.updateGroupInClassInProductInfo({ id, color, quantity })

            if (newproduct) {
                return res.json({
                    message: "update Info of Product Successfully",
                    status: true,
                    data: {
                        product: newproduct
                    }

                })
            }

        } catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,

            })
        }

    }
    async getProductByID(req, res) {
        try {

            var product = addOfferToProduct(await ProductRepositry.getProductByID(req.params.id))
            return res.json({
                message: "get Product Successfully",
                status: true,
                data: {
                    product: product
                }

            })
        }
        catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,

            })
        }
    }

    //get Products For A Merchant Or For Admin
    async getMerchantProducts(req, res) {
        try {

            let limit = 10 // Number OF Post that Return in Every Request 
            let offset = 0 + (req.query.page - 1) * limit // Get last Index that Get in previous Request 

            let products = await ProductRepositry.getAllProductByMerchantID(offset, req.params.id)

            products.map((element) => { element = addOfferToProduct(element) })


            return res.json({
                message: "get Products Successfully",
                status: true,
                data: {
                    products: products
                }

            })
        }
        catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,

            })
        }
    }

    //get Products in A Categorie  For A Merchant Or For Admin
    async getCategorieProducts(req, res) {
        try {

            let owner_id;
            console.log(req.query.owner);
            if (req.query.owner) {
                owner_id = req.query.owner;
            }
            const limit = 10 // Number OF Post that Return in Every Request 
            let offset = 0 + (req.query.page - 1) * limit // Get last Index that Get in previous Request 
            const mainCategory = req.params.cate;
            const products = await ProductRepositry.getAllProductByCategorie({ offset, mainCategory, owner_id })
            products.map((element) => { element = addOfferToProduct(element) })
            return res.json({
                message: "get Products Successfully",
                status: true,
                data: {
                    products: products
                }

            })
        }
        catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,

            })
        }
    }

    async getGalleryOfProductByID(req, res) {
        try {

            const product = await ProductRepositry.getGalProductByID(req.params.id)
            return res.json({
                message: "get gellery of Product Successfully",
                status: true,
                data: {
                    gallery: product
                }

            })
        }
        catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,

            })
        }
    }
    async getProduct(req, res) {
        try {

            if (req.query.gallery) {
                const product = await ProductRepositry.getGalProductByID(req.params.id)
                return res.json({
                    message: "get gellery of Product Successfully",
                    status: true,
                    data: {
                        gallery: product
                    }

                })
            }
            if (req.query.vrImage) {
                const product = await ProductRepositry.getVRProductByID(req.params.id)
                return res.json({
                    message: "get vr Image of Product Successfully",
                    status: true,
                    data: {
                        vrImage: product
                    }

                })
            }
            if (req.query.arImage) {
                const product = await ProductRepositry.getARProductByID(req.params.id)
                return res.json({
                    message: "get arImage of Product Successfully",
                    status: true,
                    data: {
                        arImage: product
                    }

                })
            }
            if (req.query.mainVideo) {
                const product = await ProductRepositry.getVideoProductByID(req.params.id)
                return res.json({
                    message: "get video of Product Successfully",
                    status: true,
                    data: {
                        video: product
                    }

                })
            }


        }
        catch (err) {
            return res.json({
                message: err.toString(),
                status: false,

            })
        }
    }

    async search(req, res) {
        try {

            let limit = 10 // Number OF Post that Return in Every Request 

            let offset = 0 + (req.query.page - 1) * limit // Get last Index that Get in previous Request 

            const owner_id = req.query.owner
            const { name, color, mainCategorie, price, HomePage, finished, manufacturingMaterial } = req.body;



            const products = await ProductRepositry.Search({ name, color, price, mainCategorie, finished, manufacturingMaterial, offset, owner_id, HomePage });

            products.map((element) => { element = addOfferToProduct(element) })
            return res.json({
                message: "search Successfully",
                status: true,
                data: {
                    products: products
                }

            })
        }
        catch (err) {
            console.log(err);
            return res.json({
                message: err.toString(),
                status: false,

            })
        }

    }




}
module.exports = new ProductController();