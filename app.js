const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
// load env variables
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')

// import mongoose
const mongoose = require('mongoose');

// import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')

const productRoutes = require('./routes/product')
const brainTreeRoutes = require('./routes/braintree')
const orderRoutes = require('./routes/order')

const app = express()

// db connection
mongoose.connect(
    process.env.DATABASE, 
    {useNewUrlParser: true,
        autoIndex: true,
    }
)
.then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
})

// middlewares
app.use(morgan('dev'))

app.use(bodyParser.json()) // get the json data from the request body
app.use(cookieParser())
app.use(expressValidator());
app.use(cors()); // Our API will be able to handle requests that are coming 
                 // from different origin. When we make request from 3001 to 
                 // 8000 you will get the errory sying that the cors error. So we need to use this package.
// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', brainTreeRoutes);

app.use('/api', orderRoutes)
// app.get('/', (req, res) => {
//     res.send("hello from node hoy es domingo, es asi");
// });


const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

