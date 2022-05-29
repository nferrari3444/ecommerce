const express = require("express");
const router = express.Router();


const {requireSignin,isAuth, isAdmin} = require('../controllers/auth')
const { userById, read,update, purchaseHistory} = require("../controllers/user");


router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});


router.get('/user/:userId', requireSignin, isAuth, read)
router.put('/user/:userId', requireSignin, isAuth, update)

router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory)

// Anytime there is a parameter called userID in the route, we want
// to execute user by Id method. The method will make user information available
// in the request object.


router.param('userId', userById ) // This middleware will make the user informatcion
// available in the profile an we can use that. 





module.exports = router;