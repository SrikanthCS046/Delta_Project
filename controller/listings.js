//requiring Listing Model
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res,next)=>{
     try {
    const category = req.query.category || 'Normal';
    let filter = {};
    if (category !== 'Normal') filter.category = category; // ensure category values are controlled
    const lists = await Listing.find(filter).limit(100); // add pagination in real app
    res.render('listings/home.ejs', { lists, selectedCategory: category });
  } catch (err) {
    next(err);
  }   
}

module.exports.newList=async (req,res)=>{
    // console.log("newList")
    res.render("listings/new.ejs")
}

module.exports.createListing=async (req,res,next)=>{
    // console.log(req.body)
        let response=await geocodingClient
        .forwardGeocode({
            query:req.body.listing.location,
            limit:1
        })
        .send();
        let url=req.file.path;
        let filename=req.file.filename;
        console.log(url,"...",filename)
        let home= new Listing(req.body.listing);
        home.owner=req.user._id;
        home.image={url,filename}
        home.geometry=response.body.features[0].geometry;
        let savedListing=await home.save();
        console.log(savedListing);
        req.flash("newListing","Successfully Created a new Listing")
        res.redirect("/listings");  
    
}

//show 
module.exports.showList=async(req,res)=>{
    let {id}=req.params
    // console.log(id)
    let show= await Listing.find({_id:id}).populate({
        path:"review",populate:{
            path:"author"
        }
    }).populate("owner");
    
    if(!show || show.length==0){
    req.flash("error","Listing you requested for does not exist ");
    return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{show})
}


module.exports.showEdit=async (req,res)=>{
    // console.log(req.params);
    let {id}=req.params;
    // console.log(id);
    let lists=await Listing.findById({_id:id})
    if(!lists){
    req.flash("error","Listing you are trying to edit does not exist ");
    return res.redirect("/listings");
    }

    let originalImageUrl=lists.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{lists,originalImageUrl});
    
}

module.exports.updateEdit=async (req,res)=>{
    let {id}=req.params;
    // console.log(id)
    let updated=req.body.listing;
    // console.log(updated.image)
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true})
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename}
        await listing.save();
    }
    // console.log(Listing.findOne({_id:id}))
    
    req.flash("newListing","Successfully Updated the Listing");
    res.redirect("/listings")
    
}

module.exports.deleteList=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("newListing","Successfully Deleted the Listing");
    req.flash("newListing","Successfully Deleted the Listing");
    res.redirect("/listings")
}