const Order = require("../models/orderModel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const Product = require("../models/productModel");

//Create new Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    shippingPrice,
    totalPrice,
    zipCode,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
    zipCode,
  });
  res.status(201).json({ scusses: true, order });
});

//Get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Login User Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// //Get All Orders ---Admin
// exports.getAllOrders = catchAsyncError(async (req, res, next) => {
//   const orders = await Order.find();

//   let totalAmount = 0;
//   orders.forEach((order) => {
//     totalAmount += order.totalPrice;
//   });

//   res.status(200).json({
//     success: true,
//     totalAmount,
//     orders,
//   });
// });

// //Update Order Status ---Admin
// exports.updateOrder = catchAsyncError(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHandler("Order not found with this id", 400));
//   }

//   if (order.orderStatus === "Delivered") {
//     return next(new ErrorHandler("You have already delivered this order", 400));
//   }

//   order.orderItems.forEach(async (order) => {
//     await updateStock(order.product, order.quantity);
//   });

//   order.orderStatus = req.body.status;

//   if (req.body.status === "Delivered") {
//     order.deliveredAt = Date.now();
//   }

//   await order.save({ validateBeforeSave: false });

//   res.status(200).json({
//     success: true,
//   });
// });

// //Update Stock Function
// async function updateStock(id, quantity) {
//   const product = await Product.findById(id);

//   product.stock -= quantity;

//   await product.save({ validateBeforeSave: fals++e });
// }

// //Delete Order ---Admin
// exports.deleteOrder = catchAsyncError(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHandler("Order not found with this id", 400));
//   }

//   await order.remove();

//   res.status(200).json({
//     success: true,
//   });
// });