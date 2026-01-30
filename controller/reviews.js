const Review=require("../models/review")
const Listing = require("../models/listing.js");

module.exports.postReview=async (req,res)=>{
    let {id}=req.params;
    console.log(id);

    let listing=await Listing.findById(id);
    // console.log(listing);
    let review=req.body.review;
    let newReview=new Review(review);
    // console.log(review);
    // console.log(review);
    // console.log(newReview);
    newReview.author=req.user._id;
    console.log(newReview);


    await newReview.save();
    
    listing.review.push(newReview);
    await listing.save();
  
    res.redirect(`/listings/${id}`);


}


module.exports.deleteReview=async (req,res)=>{
    // console.log(req.params);
    // console.log("hii");
    let {id,reviewId}=req.params
    
    // let listing=await Listing.findById(id);
    // console.log(listing);
    // let review=await Review.findById(reviewId);
    // console.log(review);


    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);

    
}