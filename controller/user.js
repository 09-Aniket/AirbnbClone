const User = require("../models/user.js");
//     ********** sign-up Page for User *******
module.exports.signupPage = (req, res) => {
  res.render("user/usersignup.ejs");
};

//     ******** SignUp post router **********
module.exports.registered = async (req, res) => {
  // Not to stuck at the error point
  try {
    let { username, email } = req.body;
    const newuser = new User({ email, username });
    const userdata = await User.register(newuser, req.body.password);
    console.log(userdata);
    // to automate login after signup
    req.login(userdata, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to ServiceEra");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//     ********** Login Page for User *******
module.exports.LoginPage = (req, res) => {
  res.render("User/logIn.ejs");
};

//      ************ LogInsuccess ****************
module.exports.LoginSucc = async (req, res) => {
  req.flash("Welcome Back to ServiceEra");
  let redirectURL = res.locals.RedirectUrl || "/listings";
  res.redirect(redirectURL);
};

//     ********** User LogOut *********
module.exports.UserLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You are LoggedOut!!");
      res.redirect("/listings");
    }
  });
};
