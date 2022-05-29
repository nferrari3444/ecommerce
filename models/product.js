const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 2000
    },

    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },

    category: {
        type: ObjectId, // When we refer to the product Category it will go to the category model. The type will be moongose.Schema
        ref: 'Category', // It refers to the category model. This is how we can work with relationship from one model to another.
        required: true,
        
    },

    quantity: {
        type: Number
    },

    sold: {
        type: Number ,  // If someone buy the product the sold would go up
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },

    shipping: {
        required: false,
        type: Boolean
    }
},

{timestamp: true}

);

module.exports = mongoose.model("Product", productSchema)
