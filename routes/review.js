const express=require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utlis/wrapAsync.js");
const Review=require("../models/review.js");
//requiring reviewSchma validation through Joi
const reviewSchema=require("../reviewSchemaValidation.js");
const ExpressError=require("../utlis/ExpressError.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js")

//controller
//requiring reviewController

const reviewController=require("../controller/reviews.js")


let validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview))


//to delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router;