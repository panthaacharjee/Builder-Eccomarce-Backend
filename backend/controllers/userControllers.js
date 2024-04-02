const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/USER/userModel");
const Seller = require("../models/USER/sellerModel")
const Admin = require("../models/USER/adminModel")
const Agent = require("../models/USER/agentModel")
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const cloudinary = require("cloudinary");

//Register User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const emailUser = await User.findOne({ email });
  if (emailUser) {
    return next(new ErrorHandler("This user already exist.", 400));
  }

  // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: "avatars",
  //   width: 300,
  //   height: 300,
  //   crop: "scale",
  // });
  const user = await User.create({
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

  sendToken(user, 201, res, role);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email | !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  var user;
  if(role===`Use`){
   user = await User.findOne({ email }).select("+password")
  }
  else if(role === `Sel`){
    user = await Seller.findOne({ email }).select("+password")
  }else if(role ===`Adm`){
    user = await Admin.findOne({ email }).select("+password")
  }else if(role=== `Age`){
    user = await Agent.findOne({ email }).select("+password")
  }else{
    return next(new ErrorHandler("Invalid email and password", 401));
  }
   

  if (!user) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res, role);
});

//Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  var user ;
  if(req.body.role ==="Use"){
    user = await User.findOne({ email: req.body.email });
  }else if(req.body.role ==="Sel"){
    user = await Seller.findOne({ email: req.body.email });
  }else if(req.body.role === "Adm"){
    user = await Admin.findOne({ email: req.body.email });
  }else if(req.body.role === "Age"){
    user = await Agent.findOne({ email: req.body.email });
  }else{
    return next(new ErrorHandler("Something Wrong! ", 404));
  }

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  //Get Reset Password Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `http://localhost:${process.env.FONTEND_URL}/password/reset/${resetToken}`+"," + `${req.body.role}`;
  const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it`;

  try {
    await sendMail({
      email: user.email,
      subject: `Eccomarce -- Password Recovary`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //Creating Token Hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  //resetFunction For All Type User Database Auth
  const resetFunction = async (user) => {
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res, role);
    res.status(200).json({
      success: true,
      message: "Successfully reset your password",
    });
  };

  if (req.body.role === "Adm") {
    const user = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    //One Function calling for checking reset authentication
    resetFunction(user);
  } else if (req.body.role === "Sel") {
    const user = await Seller.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    //One Function calling for checking reset authentication
    resetFunction(user);
  } else if (req.body.role === "Use") {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    //One Function calling for checking reset authentication
    resetFunction(user);
  } else if (req.body.role === "Age") {
    const user = await Agent.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    //One Function calling for checking reset authentication
    resetFunction(user);
  } else {
    return next(new ErrorHandler("Something Wrong!", 404));
  }
});


//Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  let user;
  if(req.user.role===`Adm`){
    user = await Admin.findById(req.user.id)
  }else if(req.user.role ===`Sel`){
   user = await Seller.findById(req.user.id)
  }else if(req.user.role===`Use`){
   user = await User.findById(req.user.id)
  }else if(req.user.role=== `Age`){
    user = await Agent.findById(req.user.id)
  }else{
    return next(new ErrorHandler("Something Wrong!", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// //Update User Password
// exports.updatePassword = catchAsyncError(async (req, res, next) => {
//   const user = await User.findById(req.user.id)
//     .select("+password")
//   const isPassowrdMatched = await user.comparePassword(req.body.oldPassword);

//   if (!isPassowrdMatched) {
//     return next(new ErrorHandler("Old password is incorrect", 400));
//   }
//   if (req.body.newPassword !== req.body.confirmPassword) {
//     return next(new ErrorHandler("Password does not matched", 401));
//   }

//   user.password = req.body.newPassword;
//   await user.save();

//   sendToken(user, 200, res);
// });

// //Update User Profile
// exports.updateProfile = catchAsyncError(async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//     contact: req.body.contact,
//     address: req.body.address,
//   };

//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });
//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// // Update Avatar Image
// exports.updateAvatar = catchAsyncError(async (req, res, next) => {
//   const newUserData = {};

//   if (req.body.avatar !== "") {
//     const user = await User.findById(req.user.id);

//     const imageId = user.avatar.public_id;

//     if (imageId) {
//       await cloudinary.v2.uploader.destroy(imageId);
//     }

//     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//       folder: "avatars",
//       width: 400,
//       height:400,
//       crop: "scale",
//     });

//     newUserData.avatar = {
//       public_id: myCloud.public_id,
//       url: myCloud.secure_url,
//     };
//   }
//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });
//   res.status(200).json({
//     success: true,
//     user,
//   });
// });




// //Update User Password
// exports.updatePassword = catchAsyncError(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");
//   const isPassowrdMatched = await user.comparePassword(req.body.oldPassword);

//   if (!isPassowrdMatched) {
//     return next(new ErrorHandler("Old password is incorrect", 400));
//   }
//   if (req.body.newPassword !== req.body.confirmPassword) {
//     return next(new ErrorHandler("Password does not matched", 401));
//   }

//   user.password = req.body.newPassword;
//   await user.save();

//   sendToken(user, 200, res);
// });





// // //Get Single User --Admin
// // exports.getSingleUser = catchAsyncError(async (req, res, next) => {
// //   const user = await User.findById(req.params.id);

// //   if (!user) {
// //     return next(
// //       new ErrorHandler(`User does not exist with Id : ${req.params.id}`)
// //     );
// //   }

// //   res.status(200).json({
// //     success: true,
// //     user,
// //   });
// // });

// // //Update User Role
// // exports.updateRole = catchAsyncError(async (req, res, next) => {
// //   const newUserData = {
// //     name: req.body.name,
// //     email: req.body.email,
// //     role: req.body.role,
// //   };

// //   const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
// //     new: true,
// //     runValidators: true,
// //     useFindAndModify: false,
// //   });
// //   res.status(200).json({
// //     success: true,
// //     user,
// //   });
// // });

// //Delete User  ---Admin
// exports.deleteUser = catchAsyncError(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(
//       new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
//     );
//   }

//   await user.remove();

//   res.status(200).json({
//     success: true,
//     message: "User deleted successfully",
//   });
// });


// exports.deleteUser = catchAsyncError(async (req, res, next) => {
//   const user = await User.findById(req.body.userId);

//   if (!user) {
//     return next(new ErrorHandler(`No User Found`));
//   }
//   await User.findByIdAndDelete(req.body.userId);
//   const users = await User.find();
//   res.status(200).json({
//     success: true,
//     users: users,
//   });
// });


// //Authentication Routes
// exports.getToken = catchAsyncError(async (req, res, next) => {
//   // const {token} = req.cookies;

//   res.status(200).json({
//     success: true,
//     token: req.cookies.token
//   });
// });