const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

router
  .route("/signup")
  .get(userController.signupPage)
  .post(wrapAsync(userController.registered));

router
  .route("/login")
  .get(userController.LoginPage)
  .post(
    redirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.LoginSucc
  );

//        ************* User SignUp Area ****************
// router.get("/signup", (req, res) => {
//   res.render("user/usersignup.ejs");
// });

//        ************* After using Mvc User SignUp Area ****************
// router.get("/signup", userController.signupPage);

//       ************ singup Post route *********

// router.post(
//   "/signup",
//   wrapAsync(async (req, res) => {
//     // Not to stuck at the error point
//     try {
//       let { username, email } = req.body;
//       const newuser = new User({ email, username });
//       const userdata = await User.register(newuser, req.body.password);
//       console.log(userdata);
//       // to automate login after signup
//       req.login(userdata,(err) => {
//         if (err) {
//           return next(err);
//         }
//         req.flash("success", "Welcome to ServiceEra");
//         res.redirect("/listings");
//       });
//     } catch (e) {
//       req.flash("error", e.message);
//       res.redirect("/signup");
//     }
//   })
// );

//       ************ After using singup Post route *********
// router.post("/signup", wrapAsync(userController.registered));

//        ************* User LogIn Area ****************

// router.get("/login", (req, res) => {
//   res.render("User/logIn.ejs");
// });

// router.post(
//   "/logIn",redirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   async (req, res) => {
//     req.flash("Welcome Back to ServiceEra");
//     let redirectURL=res.locals.RedirectUrl || "/listings"
//     res.redirect(redirectURL);
//   }
// );

//         ************* After using MVC User LogIn Area ****************
// router.get("/login", userController.LoginPage);

// router.post(
//   "/logIn",
//   redirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.LoginSucc
// );

//          ********* User Logout Area ***********

// router.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     } else {
//       req.flash("success", "You are LoggedOut!!");
//       res.redirect("/listings");
//     }
//   });
// });

//          *********  After Using MVC User Logout Area ***********
router.get("/logout", userController.UserLogout);

module.exports = router;
