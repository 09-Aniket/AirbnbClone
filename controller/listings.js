const { models } = require("mongoose");
const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/Geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//    ******** This is for index route ***************
module.exports.index = async (req, res) => {
  // Listing.find({}).then((res)=>{
  //     console.log(res);
  // });
  const listData = await Listing.find({});
  res.render("listings/index.ejs", { listData });
};

//    ********** This is for Render New File  for add New Listing ************
module.exports.renderNewfile = (req, res) => {
  res.render("listings/new.ejs");
};

//      *********** Show Route ***********
module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  const idlist = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!idlist) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { idlist });
  }
};

// ********* Create New Listings *********
module.exports.createListings = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  // let {title,description,image,price,location,country}=req.body;
  let listing = req.body.listing;
  const newlisting = new Listing(listing);
  // TO save geometry points of Areas
  // console.log(listing);
  newlisting.owner = req.user._id; // TO add New User Owner
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;
  let savelist = await newlisting.save();
  // console.log(savelist);
  req.flash("success", "New Listing Created!!");
  res.redirect("/listings");
};

//       ********** Edit Lisitng Route *********
module.exports.Editlisting = async (req, res) => {
  let { id } = req.params;
  const idlist = await Listing.findById(id);
  if (!idlist) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalurl = idlist.image.url;
  originalurl = originalurl.replace("/upload", "/upload/W_2/h_230");
  res.render("listings/edit.ejs", { idlist, originalurl });
};

//      *********** Update Listing Route *******
module.exports.updateList = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename };
    await list.save();
  }
  req.flash("success", " Listing Updated successfully!!");
  res.redirect(`/listings/${id}`);
};

//     ******** Delete Listing Route **********
module.exports.Deletelisting = async (req, res) => {
  let { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("success", " Listing Deleted successfully!!");
  res.redirect("/listings");
};
