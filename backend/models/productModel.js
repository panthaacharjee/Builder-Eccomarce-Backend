const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  podId:{
    type:String,
  },
  name: {
    type: String,
  },
  description :{
    type:String
  },
  price: {
    type: Number,
  },  
  regularPrice: {
    type: Number,
  },
  images: [
    {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
    }
  ],
  category:{
    type:String,
  },
  subcategory:{
    type:String,
  },

  
  stock: {
    type: Number,
    required:true,
  },
  reviews : [
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        rating : {
            type : Number,
        },
        comment : {
            type : String
        }
    }
  ],

  offerName: {
    type: String, 
    default: null
  },
  offerPrice:{
    type: Number,
    default:0
  },
  offerPercent:{
    type: Number,
    default:0
  },
  offerTime:{
    type:Date,
    default : null,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("product", productSchema);
