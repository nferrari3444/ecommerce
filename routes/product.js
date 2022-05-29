
const express = require("express");
const router = express.Router();

const {create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo, listSearch} = require('../controllers/product')
const {requireSignin, isAuth, isAdmin} = require("../controllers/auth")
const {userById} = require("../controllers/user")


router.get('/product/:productId', read,remove);
// Declare the various routes of the API and map them to their respective controllers.
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin,create); // any time there is a request coming in to sign up, this 
                               // control method will run 
// router.get('/hello', requireSignin, (req,res) => {
//     res.send("hello there")
// })

router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove)
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update)

// Route to return all the products. The method list will display all the products
router.get("/products", list)
router.get("/products/search", listSearch)  // This is our bar for the search bar. We need to create the listSearch in the controller.
// We need to send the productId, based on the part of the product that we get
// in the request.
router.get("/products/related/:productId", listRelated)
router.get("/products/categories", listCategories)
router.post("/products/by/search", listBySearch)

router.get("/product/photo/:productId", photo)

router.param("userId", userById)
// Any time the parameter productId is in the route, we run the middleware
// productById, where the product is added to the request object.
router.param("productId", productById)
module.exports = router;
