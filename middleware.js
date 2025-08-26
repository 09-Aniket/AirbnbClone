const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be loggedIn to post listing!");
    return res.redirect("/logIn");
  }
  next();
};

//       ********* Redirect middleware ********
module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.RedirectUrl = req.session.redirectUrl;
  }
  next();
};

//      ********* Check For Authorization **********
module.exports.Isowner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner of this listing!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//      ********* Check For Review Del Authorization **********
module.exports.Isauthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not author of this review!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//       ************* Validate listing Middleware ***************
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errmsg = err.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
  // console.log(err);
  // let listing = req.body.listing;
};

//     ***********  Validate Review ***************
module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};
