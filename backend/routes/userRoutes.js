const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, updateAvatar, getToken} = require("../controllers/userControllers")

router.route("/register/user").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset").put(resetPassword);
router.route("/profile/me").get(isAuthenticatedUser, getUserDetails);
// router.route("/token").get(getToken)
// router.route("/user/password/update").put(isAuthenticatedUser, updatePassword);
// router.route("/user/profile/update").put(isAuthenticatedUser, updateProfile)
// router.route("/user/avatar/update").put(isAuthenticatedUser, updateAvatar)
// router.route("/me/update").put(isAuthenticatedUser, updateProfile);
// router.route("/me/update/avatar").put(isAuthenticatedUser, updateAvatar);
// router.route("/me/update/banner").put(isAuthenticatedUser, updateBanner);
// router.route("/me/update/about").put(isAuthenticatedUser, updateAbout);

module.exports = router;