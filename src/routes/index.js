const express = require('express')
const router = express.Router()
const routerProducts = require('./products')
const routerUsers = require('./users')
const routerCategories = require('./categories')
const routerAuth = require('./auth')
const routerCart = require('./carts')
const routerOrder = require('./orders')
const routerStyles = require('./styles')
const routerColors = require('./colors')
const routerCheckout = require('./checkout')

const routes = [
    router.use('/products', routerProducts),
    router.use('/users', routerUsers),
    router.use('/categories', routerCategories),
    router.use('/styles', routerStyles),
    router.use('/colors', routerColors),
    router.use('/auth', routerAuth),
    router.use('/carts', routerCart),
    router.use('/orders', routerOrder),
    router.use('/checkout', routerCheckout),
]

module.exports = routes
