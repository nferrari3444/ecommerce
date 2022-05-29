
const express = require("express");
const router = express.Router();

const {create, categoryById, read, update, remove, list} = require('../controllers/category')
const {requireSignin, isAuth, isAdmin} = require("../controllers/auth")
const {userById} = require("../controllers/user")

router.get("/category/:categoryId", read);
// Declare the various routes of the API and map them to their respective controllers.
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin,create); // any time there is a request coming in to sign up, this 
                               // control method will run 
// router.get('/hello', requireSignin, (req,res) => {
//     res.send("hello there")
// })
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, update); // any time there is a request coming in to sign up, this 
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove); // any time there is a request coming in to sign up, this 

router.get("/categories", list); // any time there is a request coming in to sign up, this 


router.param("userId", userById)
// Anytime there is a category id in the route parameter, we want to run categoryById
// middleware
router.param("categoryId", categoryById) 


module.exports = router;
