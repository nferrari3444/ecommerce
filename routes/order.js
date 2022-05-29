const express = require("express");
const router = express.Router();
const {requireSignin,isAuth, isAdmin} = require('../controllers/auth');
const { userById, addOrderToUserHistory} = require("../controllers/user");
const {create, listOrders, getStatusValues, orderById, updateOrderStatus} = require("../controllers/order");
const {decreaseQuantity} = require("../controllers/product");

// We apply this middleware(addOrderToUserHistory) before we create a new order 
router.post('/order/create/:userId', requireSignin, isAuth, addOrderToUserHistory, decreaseQuantity, create);


router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);

// Se define el middleware getStatusValues en el order controller. En dicho middleware se muestra todos los 
// posibles status de la order para seleccionarlos desde el front-end.
router.get('/order/status-values/:userId', requireSignin, isAuth, isAdmin, getStatusValues);

router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);

router.param("userId", userById);

// Any time there is the orderId parameter in the route parameter, we will fire the orderById method
router.param("orderId", orderById);

module.exports = router;
