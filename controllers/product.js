const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs")
const {errorHandler} = require("../helpers/dbErrorHandler");
const Product = require("../models/product");


exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    
    .exec((err,product) => {
        if(err || !product) {
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product = product;
        next()
    });
};

exports.read = (req, res) => {
    req.product.photo = undefined // The photo will be too high size
    console.log(req.product);
    return res.json(req.product)
}


exports.create = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        console.log(files)
        console.log(fields)
        if(err) {
            return res.status(400).json( {
                error: 'Image could not be uploaded'
            })
        }

    // check for all fields. Grab all these properties from fields
    const {name, description, price, category, quantity,shipping} = fields
    if(!name || !description || !price || !category || !quantity || !shipping) {
        console.log(name)
        console.log(description)
        console.log(price)
        console.log(category)
        console.log(quantity)
        console.log(shipping)

        return res.status(400).json({
            error: "All fields are required"
    })
}
    let product = new Product(fields)
    // 1kb = 1000
    // 1mb = 1000000


    if (files.photo) {
        if (files.photo.size > 1000000){
            return res.status(400).json({
                error: "Image should be less than 1mb in size"
            })
            
        }
        product.photo.data = fs.readFileSync(files.photo.filepath)
        product.photo.contentType = files.photo.mimetype
    }
    product.save((err, result) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(result)
    })
    })
}

exports.remove = (req, res) => {
    let product = req.product // Whatever is the product id coming from the route
                             // that product we want to remove
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
    res.json({      
        message : "Product deleted successfully"
    });
    });                         
};




exports.update = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
         console.log('files are')
         console.log(files)
         console.log('fields are')
         console.log(fields)
        if(err) {
            return res.status(400).json( {
                error: 'Image could not be uploaded'
            });
        }

    // check for all fields. Grab all these properties from fields
//     const {name, description, price, category, quantity,shipping} = fields
//     if(!name || !description || !price || !category || !quantity || !shipping) {
//         return res.status(400).json({
//             error: "All fields are required"
//     })
// }
    let product = req.product
    console.log('Product before lodash')
    console.log(product)
    product = _.extend(product,fields);
    console.log("Product after lodash")
    console.log(product)

    console.log('fields')
    console.log(fields)
    
    // 1kb = 1000
    // 1mb = 1000000


    if (files.photo) {
        if (files.photo.size > 1000000){
            return res.status(400).json({
                error: "Image should be less than 1mb in size"
            })
            
        }
        product.photo.data = fs.readFileSync(files.photo.filepath)
        product.photo.contentType = files.photo.mimetype
    }
    product.save((err, result) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(result)
    })
    })
}

/**
// sell/arrival
* If we want to return the product by sell =
/products?sortBy=sold&order=desc&limit=4
* by arrival =
/products?sortBy=created&order=desc&limit=4
* if no params are sent, then all products are returned

*/
// If we are getting order from the route parameter we grab that.
exports.list = (req, res) => {
    console.log("req query is")
    console.log(req.query)
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'  // Entiendo que el sortBy puede ser: sold or arrival
    let limit = req.query.limit ? parseInt(req.query.limit) : 20
    console.log('entro acaaaaaaaaa')
    console.log(Product.find())
    Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err,products) => {
        if(err) {
            return res.status(400).json({
                error: 'Products not found'
            })
        }

        res.json(products)
    })

}

/**
 * it will find the products based on the req product category.
 * 1- First it will find the category of the product that we're getting in the
 * request.
 * 2 Other products that has the same category will be returned
 */

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.quer.limit) :6;

    // Find all the products not including the current product in the request,
    // because we are trying to show the related product to this product. 
    // $ne means not included. We are finding all the products based on the 
    // category that matters, the product category
    console.log('product')
    console.log(req.product)
    console.log('productCategory')
    console.log(req.product.category)
    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
        if(err) {
            return res.status(400).json({
                error: 'Products not found'
            })
        }
        res.json(products);
    })   
}

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
    if(err) {
        return res.status(400).json({
            error: 'Category not found'
        })
    }
 res.json(categories)
})
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy: "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {}

    //console.log(order, sortBy, limit,skip, req.body.filters)
    //console.log(req.body.filters[0])
    for (let key in req.body.filters) {
      //  console.log(key)
       // console.log(req.body.filters[key])
        if (req.body.filters[key].length > 0) {
          //if (Object.keys(req.body.filters) > 0) {
            if (key === "price") {
                //gte - greater than price [0-10]
                // lte - less than
                console.log('llego aca')
            findArgs[key] = {
                $gte: req.body.filters[key][0],
                $lte: req.body.filters[key][1]
            };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    console.log('skipValue')
    console.log(skip)
    console.log('sortBy')
    console.log(sortBy)
    console.log('order')
    console.log(order)
    console.log('limit')
    console.log(limit)
    //console.log(Product.find())
    Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: "Products not found"
            });
        }
        res.json({
            size: products.length,
            products
        })
    })
}

exports.photo = (req, res, next) => {

    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {}
    console.log(typeof(req.query.search))
    console.log(req.query.search)
    // assign search value to query.name
    if(req.query.search) {
        query.name = {$regex: req.query.search, $options: 'i'}  // i is for case insensitive. Regular expression capabilities for pattern matching string in queries
        // assign category value to query.category
        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => { 
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            console.log(products)
            res.json(products)

        }).select('-photo')
    }

    // Le agrego el siguiente código para que busque unicamente solo por categorías
    if ((req.query.category) &&  (req.query.search == undefined )){
        query.category = req.query.category
    
        console.log('entro aca')
    Product.find(query, (err,products) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        console.log(products)
        res.json(products)
    }).select('-photo')
}};

exports.decreaseQuantity = (req,res,next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        };
    });

    // We get either error or products
    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: "Could not update product"
            })
        }
        next();
    });


}