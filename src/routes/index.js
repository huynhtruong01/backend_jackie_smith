const express = require('express')
const router = express.Router()
const routerProducts = require('./products')
const routerUsers = require('./users')
const routerCategories = require('./categories')
const routerAuth = require('./auth')
const routerCart = require('./carts')
const routerOrder = require('./orders')

const routes = [
    router.use('/products', routerProducts),
    router.use('/users', routerUsers),
    router.use('/categories', routerCategories),
    router.use('/auth', routerAuth),
    router.use('/carts', routerCart),
    router.use('/orders', routerOrder),
]

module.exports = routes
