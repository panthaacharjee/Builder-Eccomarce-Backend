const cloudinary = require("cloudinary");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const ApiFetaures = require("../utils/apifetures");

const Product = require("../models/productModel")

/* =============================================================
        Create Product (/api/v1/create/product) (req : POST)
   ============================================================= */
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const { name, description, price, category, size, color, stock, offerName, offerPrice, offerPercent,  images, reviews } = req.body;
  


  // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: "avatars",
  //   width: 300,
  //   height: 300,
  //   crop: "scale",
  // });

  await Product.create({ name, description, price, category, size, color, stock, offerName, offerPrice, offerPercent, images, reviews });

  res.status(200).json({
    success: true,
    message: "Product Created Successfully",
  });
});

/* =============================================================
        Get All Product (/api/v1/all/product) (req : GET)
   ============================================================= */
   exports.getProducts = catchAsyncError(async (req, res, next) => {

    const apifeatures = new ApiFetaures(Product.find(), req.query).search().filter();
    const products = await apifeatures.query;

    res.status(200).json({
      success: true,
      products: products
    });
});

/* =============================================================
        Get Single Product (/api/v1/product/:id) (req : GET)
   ============================================================= */
   exports.getProduct = catchAsyncError(async (req, res, next) => {
    const product= await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: {
        path: "user",
        options: { strictPopulate: false },
      },
    })

    res.status(200).json({
      success: true,
      product:product
    });
});

/* =============================================================
        Flash Sale  (/api/v1/flash/sell/product) (req : GET)
   ============================================================= */
   exports.flashSale = catchAsyncError(async (req, res, next) => {
    const products = await Product.find({offerName:"Flash Sale"}).populate({
      path: "reviews",
      populate: {
        path: "user",
        options: { strictPopulate: false },
      },
    })
 
    res.status(200).json({
      success: true,
      products:products
    });
});
  
/* =============================================================
        New Arrival  (/api/v1/new/arrival/product) (req : GET)
   ============================================================= */
   exports.newArrival = catchAsyncError(async (req, res, next) => {
    const products = await Product.find().populate({
      path: "reviews",
      populate: {
        path: "user",
        options: { strictPopulate: false },
      },
    })
    let filterProducts = []

    let date = new Date(Date.now())
    let monthNow  = date.getMonth()+1
    let yearNow = date.getFullYear()


    products.map((val)=>{
      const date = new Date(val.createdAt)
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      
      if(month == monthNow && year == yearNow){
        filterProducts.push(val)
      }
    })
    // console.log()
    res.status(200).json({
      success: true,
      products:filterProducts
    });
});

/* =============================================================
        Top Rated  (/api/v1/top/rated/product) (req : GET)
   ============================================================= */
   exports.topRated = catchAsyncError(async (req, res, next) => {
    const products = await Product.find({}).populate({
      path: "reviews",
      populate: {
        path: "user",
        options: { strictPopulate: false },
      },
    })
    let filterProducts = []


    products.map((val)=>{

      // console.log(val.reviews.length)
      if(val.reviews.length>=4){
        let initialValue = 0
        const rate = val.reviews.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          initialValue,
        );
        const finalRate = rate/val.reviews.length
        if(finalRate>=4){
          filterProducts.push(val)
        }
      }
    })
    // console.log()
    const finalProducts = filterProducts.sort(function (a, b){
      return b.reviews.length - a.reviews.length
    })
    res.status(200).json({
      success: true,
      products:finalProducts
    });
});


