if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
// console.log(process.env.CLOUD_API_KEY);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const port = 8080;
const dbUrl=process.env.ATLAS_DB_URL;
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))
const ExpressError=require("./utlis/ExpressError.js");
const session=require("express-session");
let MongoStore=require("connect-mongo");
if (MongoStore && MongoStore.default) MongoStore = MongoStore.default;
const flash=require("connect-flash");

//requiring user router

const userRouter=require("./routes/user.js")

//To set Authentication using passport
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


async function main() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

main()
  .then(() => {
    console.log("Connection successful");
  })

const store=MongoStore.create({
    mongoUrl:dbUrl,
    clientPromise: mongoose.connection.asPromise(),
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",(err)=>{
    console.log("There is a Error in Mongo Session",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


//rquiring express router for listing.js

const listings=require("./routes/listings.js");

//rquiring express router for review.js

const reviews=require("./routes/review.js");


app.use(session(sessionOptions));
app.use(flash());

//passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.message=req.flash("newListing");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
    
})


app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews)
app.use("/",userRouter)


app.use((req, res, next) => {
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message}=err;

    res.render("listings/error.ejs",{statusCode,message});

});

app.listen(port,()=>{
    console.log("Server is listening to the port 8080");
})


