const {Order, CartItem} = require('../models/order')
const {errorHandler} = require("../helpers/dbErrorHandler");


exports.orderById = (req, res,next,id) => {
    Order.findById(id)
    // Each order have products, and products is an array that contains one or more products
    .populate('products.product', 'name price') // we also need the name and the price of the product. Execute callback
    .exec((err,order) => {
        if(err || !order) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // We make the order available on the request object
        req.order = order
        next() // Once you find the orderById, execute the callback
    })    
}





exports.create = (req,res) => {
//    console.log('CREATE ORDER: ', req.body);
// In the order that we get from the frontend, we also add the user property and we assign this value(req.profile) 
// to the user. Se le asigna req.profile al parámetro user porque el mismo viene como undefined
req.body.order.user = req.profile
console.log(req.body.order)
console.log('req profile is ')
console.log(req.profile)
const order = new Order(req.body.order)
order.save((error,data) => {
    if(error){
        return res.status(400).json({
            error:errorHandler(error)
        })
    }
    // if there is no error, send the json response of the data. Once we save the order, we cand send the json data
    res.json(data)
})

};

exports.listOrders = (req, res) =>{
    Order.find()
    .populate('user', '_id name address')
    .sort('-created')
    .exec((err, orders) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(orders);
    })
}

exports.getStatusValues = (req,res) => {

    // This way we can send the values to the front end client
    res.json(Order.schema.path("status").enumValues);
};

// Send the orderId from the front end client and also the status
exports.updateOrderStatus = (req,res) => {
    console.log(req.body.orderId)
    console.log(req.body.status)
    // Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
    //     if (err) {

    Order.update({_id: req.body.orderId}, {$set: {status: req.body.status}} , (err,order) => {
       
        
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            console.log(order)
            res.json(order)
        }

    )
}
