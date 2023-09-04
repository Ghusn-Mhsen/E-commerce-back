const mongoose = require('mongoose');

// const OfferType = Object.freeze({
//     DISCOUNT: 'discount',
//     PERCENTAGE: 'percentage',
//   });
let timestampPlugin = require('../../utils/plugins/timestamp')
const ProductSchema = mongoose.Schema({
    name: String,
 
   
    
    descreption: {
        type: String,
        //required: true,
    },
  
    mainCategorie: {
        type: String,
       // required: true,
    },
   
   
   
    Class:[
      
        {
            
            size:String,
            length:Number,
            width:Number,
            price:Number,
            priceAfterDiscount:Number,
            sallableInPoints:Boolean,
            
            group:[
                {
                   color:String ,
                   quantity:Number,
                }
            ],
         }
    ],
        mainImage:{
            type:String,
            
        },
           gallery:[
            {
                type:String, 
            }],
            mainVideo:{
                type:String,
                
            },
            vrImage:{
                type:String,
                
            },
            arImage:{
                type:String,
                
            },
       owner_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       },
      
       offers:[
       
        {
          valueOfOffer:Number,
          typeOfOffer: {
            type: String,
            enum: ['discount','percentage'],
            validate: {
              validator: function(v) {
                console.log('typeOfOffer value:', v);
                if (v === 'discount') {
                  
                  if (this.Class) {
                    const classPrices = this.Class.map(c => c.price);
                    console.log(classPrices)
                    console.log(this.valueOfOffer)
                    console.log(this.valueOfOffer <= minPrice);
                    const minPrice = Math.min(...classPrices);
                    return this.valueOfOffer < minPrice;
                  }
                  return true;
                }
                return true;
              },
              message: props => `${props.value} is not a valid type of offer.`
            }
          },
          startDateOfOffers:Date,
          endDateOfOffers:Date,
         
          ActiveUser:{
            type:Boolean,
            default:true,
          },
        }
      ],
      HomePage:{
     type:Boolean,
     default:false
      },
      deliveryAreas:[
        {
            location:String,
            deliveryPrice:Number

        }
    ],
       Guarantee:Number,
       manufacturingMaterial:String
    
});


 ProductSchema.plugin(timestampPlugin)
module.exports = mongoose.model('Product', ProductSchema);
