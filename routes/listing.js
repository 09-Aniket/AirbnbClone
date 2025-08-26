const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, Isowner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//        *********** TO shorten outer get post method use router.route ********

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListings)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewfile);

router
  .route("/:id")
  .get(wrapAsync(listingController.showRoute))
  .put(isLoggedIn, Isowner,upload.single("listing[image]"), wrapAsync(listingController.updateList))
  .delete(isLoggedIn, Isowner, wrapAsync(listingController.Deletelisting));

// ************ Index Route ***********
// route.get(
//   "/",
//   wrapAsync(async (req, res) => {
//     // Listing.find({}).then((res)=>{
//     //     console.log(res);
//     // });
//     const listData = await Listing.find({});
//     res.render("listings/index.ejs", { listData });
//   })
// );

//         ********** After using MVC Index ROuter Looks like *********
// router.get("/", wrapAsync(listingController.index));

//           ************* Create New ROute form **************

// route.get("/new", isLoggedIn, (req, res) => {
//   res.render("listings/new.ejs");
// });

//    ********** After using MVC Create New ROute  Looks like *********
// router.get("/new", isLoggedIn, listingController.renderNewfile);

//            ************* ShoW Route ************
// route.get(
//   "/:id",

//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const idlist = await Listing.findById(id)
//       .populate({ path: "reviews", populate: { path: "author" } })
//       .populate("owner");
//     if (!idlist) {
//       req.flash("error", "Listing you requested for does not exist!");
//       res.redirect("/listings");
//     } else {
//       res.render("listings/show.ejs", { idlist });
//     }
//   })
// );

//        ********** After using MVC Show Route  Looks like *********
// router.get("/:id", wrapAsync(listingController.showRoute));

// route.get(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const idlist = await Listing.findById(id);
//     if (!idlist) {
//       req.flash("error", "Listing you requested for does not exist!");
//       res.redirect("/listings");
//     } else {
//       res.render("listings/show.ejs", { idlist });
//     }
//   })
// );

//                   *********** Create  route **********

// route.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(async (req, res, next) => {
//     // let {title,description,image,price,location,country}=req.body;
//     let listing = req.body.listing;
//     const newlisting = new Listing(listing);
//     // console.log(listing);
//     newlisting.owner = req.user._id; // TO add New User Owner
//     await newlisting.save();
//     req.flash("success", "New Listing Created!!");
//     res.redirect("/listings");
//   })
// );

//    ********** After using MVC Create new listings  Route  Looks like *********
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListings)
// );

// *********** Edit Route ************
// route.get(
//   "/:id/edit",
//   isLoggedIn,
//   Isowner,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const idlist = await Listing.findById(id);
//     if (!idlist) {
//       req.flash("error", "Listing you requested for does not exist!");
//       res.redirect("/listings");
//     } else {
//       res.render("listings/edit.ejs", { idlist });
//     }
//   })
// );

//    ********** After using MVC Edit listings  Route  Looks like *********
router.get(
  "/:id/edit",
  isLoggedIn,
  Isowner,
  wrapAsync(listingController.Editlisting)
);

// ********* Update Route **********

// route.put(
//   "/:id",
//   isLoggedIn,
//   Isowner,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", " Listing Updated successfully!!");
//     res.redirect(`/listings/${id}`);
//   })
// );

//    ********** After using MVC Update Existing  listings  Route  Looks like *********
// router.put(
//   "/:id",
//   isLoggedIn,
//   Isowner,
//   wrapAsync(listingController.updateList)
// );

// ******* Delete Route ********

// route.delete(
//   "/:id",
//   isLoggedIn,
//   Isowner,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const deleted = await Listing.findByIdAndDelete(id);
//     console.log(deleted);
//     req.flash("success", " Listing Deleted successfully!!");
//     res.redirect("/listings");
//   })
// );

//    ********** After using MVC Delete Existing  listings  Route  Looks like *********
// router.delete(
//   "/:id",
//   isLoggedIn,
//   Isowner,
//   wrapAsync(listingController.Deletelisting)
// );

module.exports = router;
