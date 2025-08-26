// const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//     ********** Post route for Review **********
module.exports.postReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  console.log(newreview.author);
  console.log(req.user);
  listing.reviews.push(newreview);

  await newreview.save();
  await listing.save();

  // console.log("Review save successfully");
  // res.send("Review Successfully!!");
  req.flash("success", "New Review Created Successfully!!");
  res.redirect(`/listings/${req.params.id}`);
};

//        ********* Destroy review *******
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted Successfully!!");
  res.redirect(`/listings/${id}`);
};
