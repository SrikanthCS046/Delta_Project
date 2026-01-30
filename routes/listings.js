
console.log(process.env.CLOUD_API_KEY);
const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utlis/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utlis/ExpressError.js");
const {isLoggedIn,isOwner}=require("../middleware.js")
const multer=require("multer");
const {cloudinary,storage}=require('../cloudConfig.js');
const upload=multer({storage});


//controller 
//requiring all the core functionality
const listingController=require("../controller/listings.js")



let validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
}
    else{
        next();
    }
}

//router.route

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing))//creating new Listing post method

router.get("/logo",(req,res)=>{
    res.render("listings/logo.ejs");
})
//New 
router.get("/new",isLoggedIn,wrapAsync(listingController.newList))


router.route("/:id")
//show 
.get(wrapAsync(listingController.showList))
//Update
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateEdit))
//delete
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteList))

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.showEdit))


router.post("/search",async (req,res)=>{
    console.log(req.body);
    dest=req.body.query;
    let lists=await Listing.find({title:dest});
    if(lists){
        res.render('listings/home.ejs',{lists})
    }
})


module.exports=router;