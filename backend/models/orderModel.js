const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    city:{
      type:String,
      required:true
    },
    contact:{
      type:String,
      required:true,
    }
    
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      color:{
        type:String,
      },
      size:{
       type:String 
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  paymentInfo: {
    status: {
      type: String,
    },
    system:{
      type: String
    },
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "payment"
    }
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  shippingPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: "Processing",
  },
  deleveredAt: {
    type:Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("order", orderSchema);