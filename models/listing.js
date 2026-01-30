const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")
const listingSchema=new Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String
    },
    image: {
    filename:String,
    url:String,
},
    price:{
        type:Number,
        default:10,
        require:true
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    category:{
        type:String,
        enum:["Normal","Camping","Arctic","Top of the World","Resort","Farm Stays","Desert","Tree houses"],
        required: true
    }
})

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.review}});
    }
})

let Listing=mongoose.model("listing",listingSchema);

module.exports=Listing;



