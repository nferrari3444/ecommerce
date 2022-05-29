const { Router } = require("express");
const express = require("express");
const router = express.Router();

const {signup, signin, signout, requireSignin} = require('../controllers/auth')
const {userSignupValidator} = require("../validator");


// Declare the various routes of the API and map them to their respective controllers.
router.post("/signup",  userSignupValidator , signup); // any time there is a request coming in to sign up, this 
                               // control method will run 

router.post("/signin", signin);

router.get("/signout", signout);

// router.get('/hello', requireSignin, (req,res) => {
//     res.send("hello there")
// })

module.exports = router;
