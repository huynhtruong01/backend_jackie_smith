require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY)

const CheckoutController = {
    payment: (req, res) => {
        console.log(req.body)
        stripe.charges.create(
            {
                source: req.body.tokenId,
                amount: req.body.amount,
                currency: 'usd',
            },
            (error, data) => {
                console.log(error)
                if (error) {
                    res.status(500).json({ error, message: 'Payment failed' })
                } else {
                    res.status(200).json({ data, message: 'Payment successfully' })
                }
            }
        )
    },
}

module.exports = CheckoutController
