const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/USER/userModel");
const Admin = require("../models/USER/adminModel")



exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    next(new ErrorHandler("Please Login to access this resource", 401));
  } else {
   
    const finalToken = token.split(",")
    const decodeData = jwt.verify(finalToken[0], process.env.JWT_SECRET);

    
    if(finalToken[1] === "Use"){
      req.user = await User.findById(decodeData.id);
    }
    if(finalToken[1] === "Adm"){
      req.user = await Admin.findById(decodeData.id);
    }
  // console.log(req.user)
    
  }
  // console.log(req.user)
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
