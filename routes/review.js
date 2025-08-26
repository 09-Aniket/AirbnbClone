const express = require("express");
const route = express.Router({ mergeParams: true });
// const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validatereview, isLoggedIn,Isauthor } = require("../middleware.js");


const reviewController=require("../controller/reviews.js");

//         *********** Review Route **************
// route.post(
//   "/",
//   isLoggedIn,
//   validatereview,
//   wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newreview = new Review(req.body.review);
//     newreview.author=req.user._id;
//     console.log(newreview.author);
//     console.log(req.user);
//     listing.reviews.push(newreview);

//     await newreview.save();
//     await listing.save();

//     // console.log("Review save successfully");
//     // res.send("Review Successfully!!");
//     req.flash("success", "New Review Created Successfully!!");
//     res.redirect(`/listings/${req.params.id}`);
//   })
// );

//        *********** After using MVC post Review Route *************
route.post(
  "/",
  isLoggedIn,
  validatereview,
  wrapAsync(reviewController.postReview)
);


//         *********** Delete Review Route **************
// route.delete(
//   "/:reviewId",
//   isLoggedIn,
//   Isauthor,
//   wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success", " Review Deleted Successfully!!");
//     res.redirect(`/listings/${id}`);
//   })
// );


//        *********** After using MVC Delete  Review Route *************
route.delete(
  "/:reviewId",
  isLoggedIn,
  Isauthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = route;
