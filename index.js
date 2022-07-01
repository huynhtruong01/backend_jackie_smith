const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectData = require('./config/data')
const routes = require('./src/routes')
const cookieParser = require('cookie-parser')
const app = express()
const path = require('path')
const passport = require('passport')
const cookieSession = require('cookie-session')
const passportSetup = require('./src/utils/passport')

const port = process.env.PORT || 5000

// config dotenv
dotenv.config()

app.use(express.static(path.join(__dirname, 'public')))
// use morgan, cors, json, passport
app.use(morgan('common'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use(cookieSession({ name: 'session', keys: ['huynh_truong'], maxAge: 24 * 60 * 60 * 100 }))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors())

// connect data
connectData()

// routes
app.use('/api', routes)

// run server
app.listen(port, () => console.log('Server is running....' + port))
