const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const mongoURL = "mongodb://127.0.0.1:27017/GowthamiOdyssey";

async function main(){
    await mongoose.connect(mongoURL);
}

main().then(()=>{
    console.log("Connection successful")
})
.catch(err=>{
    console.log(err);
})


const initDb= async ()=>{
   await Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>({...obj,owner:'696f646293e4d13492e52509'}));
   await Listing.insertMany(initData.data);
   console.log("data saved successfully");
    
}
initDb();