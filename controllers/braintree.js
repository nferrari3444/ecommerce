const User = require('../models/user');  // we get the user model from the models directory
const braintree = require('braintree')
require('dotenv').config()



const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey : process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});


// Es el middleware que se utiliza en la ruta the getToken(router.get("/braintree/getToken/:userId"));
// Generate a token and send to the client
exports.generateToken = (req, res) => {
    //
    gateway.clientToken.generate({}, function(err, response) {
        if(err) {
            res.status(500).send(err)
        } else {
            console.log(response)
            res.send(response)
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;

    console.log(amountFromTheClient)
    // charge
    let newTransaction = gateway.transaction.sale({

        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(result);
        }
    })
}