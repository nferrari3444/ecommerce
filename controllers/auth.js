const User = require('../models/user')  // we get the user model from the models directory
const {errorHandler} = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken') // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const res = require('express/lib/response');


exports.signup = (req, res) => {
    console.log('req.body', req.body)
    const user = new User(req.body)

    user.save((err,user) => {       // use the callback function to handle whatever took place
                                     // when the user logged in
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: errorHandler(err)
            //error: err.msg
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        })
    })                               
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password} = req.body;
    console.log(email)
    console.log(password)
    User.findOne({email} , (err, user) => {
        if (err || !user) {
            return res.status(400).json({
            error: "User with that email does not exist. Please signup"
            });
        }

        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            })
        }
        // generate  a signed token with user id and secret
        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "200000000"})
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
        // return response with user and token to frontend client

        const {_id, name, email, role} = user
        return res.json({token, user: {_id, email, name, role} })

    })
}

exports.signout = (req,res) => {
    res.clearCookie("t");


    res.json({message: "Signout Successfully"})
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if (!user && req.auth.role === 0 ) {
        return res.status(403).json({
            error: "Access denied"
        })
    }
    next()
}

exports.isAdmin = (req, res,next) => {
    console.log('role is')
    console.log(req.profile)
    console.log(req.profile.role)
    if (req.profile.role != 1) {
        return res.status(403).json({
            error: "Admin resource! Access denied"
        })
    }
    next();
};


