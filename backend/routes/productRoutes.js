const express = require("express");
const { createProduct, getProducts, getProduct, flashSale, newArrival, topRated } = require("../controllers/productControllers");
const router = express.Router();
// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


//Routes
router.route("/create/product").post(createProduct);
router.route("/all/product").get(getProducts)
router.route("/product/:id").get(getProduct)
router.route("/flash/sell/product").get(flashSale)
router.route("/new/arrival/product").get(newArrival)
router.route("/top/rated/product").get(topRated)

// router
//   .route("/register/student")
//   .post(isAuthenticatedUser, authorizeRoles("Admin"), registerStudent);

// router
//   .route("/register/teacher")
//   .post(isAuthenticatedUser, authorizeRoles("Admin"), registerTeacher);

// router
//   .route("/create/question")
//   .post(isAuthenticatedUser, authorizeRoles("Admin"), createQuestion);

// router
//   .route("/all/question")
//   .get(isAuthenticatedUser, authorizeRoles("Admin"), allQuestion);
// router
//   .route("/create/routine")
//   .post(isAuthenticatedUser, authorizeRoles("Admin"), createRoutine);

//   router
//   .route("/teacher/routine/update/:id")
//   .put(isAuthenticatedUser, authorizeRoles("Admin"), updateTeacherRoutine);

// router.route("/all/teacher").get(getTeachers);
// router.route("/all/student").get(getStudents);
// router.route("/teacher/:id").get(getTeacher);
// router.route("/delete/teacher/:id").delete(deleteTeacher);

// router.route("/student/:id").get(getStudent);
// router.route("/delete/student/:id").delete(deleteStudent);

// router.route("/delete/question/:id").delete(deleteQuestion);
// router.route("/delete/routine/:id").delete(deleteRoutine);


// router.route("/all/routine").get(getRoutines);

module.exports = router;
