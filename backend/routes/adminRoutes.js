const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { registerAdmin,  getAllUser, getUser,  deleteUser, createProduct, getAllProduct, getSingleProduct, deleteProduct, updateProduct, getAllOrder, getSingleOrder, deleteOrder } = require("../controllers/adminControllers");

router.route("/register/admin").post(isAuthenticatedUser, authorizeRoles("admin"), registerAdmin);
router.route("/get/all/user").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.route("/get/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUser);
router.route("/delete/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

router.route("/create/product").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/get/admin/product").get(isAuthenticatedUser, authorizeRoles("admin"), getAllProduct);
router.route("/admin/product/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleProduct);
router.route("/delete/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
router.route("/update/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)


router.route("/get/admin/order").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrder);
router.route("/admin/order/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder);
router.route("/delete/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
router.route("/update/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
module.exports = router;