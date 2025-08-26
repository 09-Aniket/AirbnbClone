if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const signupRoute = require("./routes/users.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Database url
const dburl = process.env.ATLASDB_URL;

//    ************ Mongo session **************
const Mstore = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

//     *********** Express _session ********
const sessionoption = {
  MongoStore:Mstore,
  secret: process.env.SECRET,
  resave: "false",
  saveUninitialized: "true",
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



main()
  .then(() => {
    console.log("Connection SuccessFull!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

// app.get("/", (req, res) => {
//   res.send("Hii,I am root");
// });

app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//      **********DEMO USER ************
// app.get("/demouser", async (req, res) => {
//   const fakeuser = new User({
//     email: "Aniket23@gmial.com",
//     username: "AK_93",
//   });

//   let registereduser = await User.register(fakeuser, "Helloworld");
//   res.send(registereduser);
// });

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", signupRoute);

// app.get("/testlising",async(req,res)=>{
//     let sampledata=new Listing({
//         title:"My Villa",
//         description:"Life Better ",
//         price:2000,
//         location:"calangute Goa",
//         country:"india"
//     });

//     await sampledata.save();
//     console.log("listing save successfull");
//     res.send("Lising sucessfull saved!");
// })

// // Standard response
// app.all("*all", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// app.all('*', (req, res, next) => {
//   console.log(`Request received for method: ${req.method} and path: ${req.path}`);
//   next(); // Pass control to the next handler in the middleware chain
// });

// Error Handeling
app.use((err, req, res, next) => {
  let { statuscode = 500, message = "somethings Went Wrong!" } = err;
  // res.send("Something Went Wrog!");
  console.log(err);
  res.render("listings/error.ejs", { err });
  // res.status(statuscode).send(message);
});

const port = 8080;
app.listen(port, () => {
  console.log(`App is listen to the port:${port}`);
});
