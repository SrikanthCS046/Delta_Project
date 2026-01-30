const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const flash=require("connect-flash");
const wrapAsync = require("../utlis/wrapAsync.js");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controller/user.js");

router.route("/signup",)
.get(userController.getSignUp)
.post(wrapAsync(userController.postSignUp))


//login
router.route("/login")
.get(userController.getLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
userController.postLogin)
router.get("/logout",userController.logout)

module.exports=router;