const Listing=require("./models/listing")
const Review=require("./models/review")
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req)
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl)
        req.flash("error", "Login In to Continue");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
        if(req.session.redirectUrl){
            res.locals.redirectUrl=req.session.redirectUrl;
            // console.log(res.locals.redirectUrl)
        }
        next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author Of This Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}