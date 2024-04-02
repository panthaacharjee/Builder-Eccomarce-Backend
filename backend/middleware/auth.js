const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/USER/userModel");
const Admin = require("../models/USER/userModel")
const Seller  = require("../models/USER/sellerModel")
const Agent = require("../models/USER/agentModel")



exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token)

  if (!token) {
    next(new ErrorHandler("Please Login to access this resource", 401));
  } else {
   
    const finalToken = token.split(",")
    const decodeData = jwt.verify(finalToken[0], process.env.JWT_SECRET);

    if(finalToken[1]==="Use"){
      req.user = await User.findById(decodeData.id);
    }else if(finalToken[1]=== "Sel"){
      req.user = await Seller.findById(decodeData.id);
    }else if(finalToken[1]=== "Adm"){
      req.user = await Admin.findById(decodeData.id);
    }else if(finalToken[1]=== "Age"){
      req.user = await Agent.findById(decodeData.id);
    }else{
      next(new ErrorHandler("Something Wrong!", 404));
    }
    
  }
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
