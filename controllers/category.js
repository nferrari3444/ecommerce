const Category = require("../models/category")

const {errorHandler} = require("../helpers/dbErrorHandler");
const category = require("../models/category");


// With this method in place we can get a simple category
exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Category does not exist"
            });
        }
    req.category = category
    next()

    })
}



exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
    res.json({data})
    })

}

exports.read = (req, res) => {
    return res.json(req.category)
}

exports.update = (req, res) => {
    console.log('category en request')
    console.log(req.category)
    const category = req.category;
    // Update the name field from category object
    console.log(req.body)
    category.name = req.body.name; // We send the name in the request body
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    })

}

exports.remove = (req, res) => {

    const category = req.category;
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
    res.json({
        message: "Category deleted"
    })
    })
}

exports.list = (req, res) => {
    //The find method will give all the categories
    Category.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    })
}

