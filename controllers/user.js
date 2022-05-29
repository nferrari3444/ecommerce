const User = require('../models/user');
const _= require('lodash');
const {errorHandler} = require("../helpers/dbErrorHandler");
const {Order} = require('../models/order');

// The id will be coming from the route parameter
// execute a callback function(exec)
//Add that user information to the request object with the name of profile again

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err,user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next(); // Let it go to the next phase because this is a middleware.
              // An application continue it flow and doesn't get stuck
    })
}


exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    console.log('req.profile is')
    console.log(req.profile)
    return res.json(req.profile);
}

exports.update = (req, res,next) => {
    let user = req.profile;
    user = _.extend(user, req.body); // extend-mutate the source object
    user.updated = Date.now();
    user.save(err => {
        if (err) {
            return res.status(400).json({
                error: 'You are not authorized to perform this action'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({user});

    });

    // User.findOneAndUpdate({_id : req.profile._id}, {$set: req.body}, {new:true}, 
        
    //     (err, user) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 error: 'You are not authorized to perform this action'
    //             })
    //         }
    //        user.hashed_password = undefined
    //        user.salt = undefined

    //        res.json(user)
    //     })
}

exports.addOrderToUserHistory = (req, res,next) => {
    let history = []
    req.body.order.products.forEach((item) => { history.push({
        _id: item._id, 
        name: item.name,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        transaction_id: req.body.order.transaction_id,
        amount: req.body.order.amount
        
    });
})

// Push the user history to the history object with the $push method
User.findOneAndUpdate({_id: req.profile._id}, {$push: {history:history}}, 
    {new:true} ,
    (error, data) => {
        if(error) {
        return res.status(400).json({
            error: "Could not update user purchase history"
        });
    }
    next()
}
);
};


exports.purchaseHistory = (req, res) => {
    // Each order have a user associated that refers to the user model. Find the order based on the user
    Order.find({user: req.profile._id})
    .populate('user', '_id name')   // populate the user with the id and name
    .sort('-created')
    .exec((err, orders) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(orders);
    })}
