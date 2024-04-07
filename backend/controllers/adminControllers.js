const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/USER/userModel");
const Admin = require("../models/USER/adminModel")
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");
const ApiFetaures = require("../utils/apifetures");
const Product  = require("../models/productModel")
const Order = require("../models/orderModel")

//Register Admin
exports.registerAdmin = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const emailUser = await Admin.findOne({ email });
    if (emailUser) {
      return next(new ErrorHandler("This user already exist.", 400));
    }
  
    // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //   folder: "avatars",
    //   width: 300,
    //   height: 300,
    //   crop: "scale",
    // });
     await Admin.create({
      name,
      email,
      password,
      avatar: {
        // public_id: myCloud.public_id,
        // url: myCloud.secure_url,
        public_id: "myCloud.public_id",
        url: "myCloud.secure_url",
      },
    });
    res.status(200).json({
      success:true,
      message:"Successfully Admin Created!",
    })
  });



/* =============================================================
        Get All User (/api/v1/all/user) (req : GET)
   ============================================================= */
   exports.getAllUser = catchAsyncError(async (req, res, next) => {

    const apifeatures = new ApiFetaures(User.find(), req.query).search()
    const user = await apifeatures.query;

    res.status(200).json({
      success: true,
      users: user
    });
});

/* =============================================================
        Get Single User (/api/v1/user/:id) (req : GET)
   ============================================================= */
   exports.getUser = catchAsyncError(async (req, res, next) => {
    const user= await User.findById(req.params.id)

    res.status(200).json({
      success: true,
      user:user
    });
});

/* =============================================================
        Delete User (/api/v1/delete/user/:id) (req : DELETE)
   ============================================================= */
   exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user= await User.findById(req.params.id)
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    } 

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message:"Successfully User Deleted"
    });
});


/* =============================================================
        Create Product (/api/v1/create/product) (req : Post)
   ============================================================= */
   exports.createProduct = catchAsyncError(async (req, res, next) => {
    const { name, description,regularPrice, price, category, subcategory, stock,  images, id} = req.body;
  


    // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //   folder: "avatars",
    //   width: 300,
    //   height: 300,
    //   crop: "scale",
    // });
  
    await Product.create({ name, description, regularPrice, price, category, subcategory, stock,  images, podId:id  });
  
    res.status(200).json({
      success:true,
      message:"Successfully Product Created!"
    })
  });
  
  /* =============================================================
          Get All Product (/api/v1/get/admin/product) (req : GET)
     ============================================================= */
     exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  
      const apifeatures = new ApiFetaures(Product.find({createdAt:-1}), req.query).search().filter();
      const products = await apifeatures.query;
  
      res.status(200).json({
        success: true,
        products: products
      });
  });
  
  /* =============================================================
          Get Single Product (/api/v1/admin/product/:id) (req : GET)
     ============================================================= */
     exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
      const product= await Product.findById(req.params.id)
  
      res.status(200).json({
        success: true,
        product:product
      });
  });

  /* =============================================================
          Delete Product (/api/v1/delete/product/:id) (req : GET)
     ============================================================= */
     exports.deleteProduct = catchAsyncError(async (req, res, next) => {
      const product= await Product.findById(req.params.id)

      if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    } 

    await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message:"Successfully Product Deleted!"
      });
  });
  
  
    
  /* =============================================================
          Update Product (/api/v1/update/product/:id) (req : GET)
     ============================================================= */
     exports.updateProduct = catchAsyncError(async (req, res, next) => {
      const product= await Product.findById(req.params.id)

      if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    } 

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      regularPrice: req.body.regularPrice,
      podId:req.body.id
    };
    await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    const updateProduct = await Product.findById(req.params.id);
       res.status(200).json({
        success: true,
        message:"Successfully Product Updated!",
        product:updateProduct
      });
  });

  /* =============================================================
          Get All Order (/api/v1/get/admin/order) (req : GET)
     ============================================================= */
     exports.getAllOrder = catchAsyncError(async (req, res, next) => {
  
      const apifeatures = new ApiFetaures(Order.find({createdAt:-1}), req.query).search().filter();
      const orders = await apifeatures.query;
  
      res.status(200).json({
        success: true,
        orders:orders
      });
  });
  
  /* =============================================================
          Get Single Order (/api/v1/admin/order/:id) (req : GET)
     ============================================================= */
     exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
      const order= await Order.findById(req.params.id)
  
      res.status(200).json({
        success: true,
        order:order
      });
  });

  /* =============================================================
          Delete Order (/api/v1/delete/product/:id) (req : GET)
     ============================================================= */
     exports.deleteOrder= catchAsyncError(async (req, res, next) => {
      const order= await Order.findById(req.params.id)

      if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    } 

    await Order.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message:"Successfully Order Deleted!"
      });
  });
  
  /* =============================================================
          Update (/api/v1/update/order/:id) (req : Put)
     ============================================================= */
     exports.updateOrder= catchAsyncError(async (req, res, next) => {
      const order= await Order.findById(req.params.id)

      if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    } 

    
    await Order.findByIdAndUpdate(req.params.id, {orderStatus:req.body.status}, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    const updateOrder = await Order.findById(req.params.id);
      res.status(200).json({
        success: true,
        message:"Successfully Order Updated!",
        order:updateOrder
      });
  });
  