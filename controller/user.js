const User=require("../models/user.js");
const flash=require("connect-flash");

//getting signup page
module.exports.getSignUp=(req,res)=>{
    res.render("user/signup.ejs")
}


//post SignUp page
module.exports.postSignUp=async (req,res)=>{
    try{
    let {username,email,password}=req.body
    let newUser=new User({email,username})
    let registeredUser=await User.register(newUser,password)
    console.log(registeredUser)
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("newListing","Welcome to Gowthami Oddessy");
      res.redirect("/listings")
    })
    }
    catch(e){
        req.flash("error","User already exits");
        res.redirect("/signup");
    }
    
}

module.exports.getLogin=(req,res)=>{
    res.render("user/login.ejs")
}

module.exports.postLogin=async (req,res)=>{
    req.flash("newListing","Welcome to Gowthami Oddessy");
    let redirect=res.locals.redirectUrl||"/listings"
    res.redirect(redirect);

}

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    req.flash("newListing","Logged you Out");
    res.redirect("/login")
    })
}