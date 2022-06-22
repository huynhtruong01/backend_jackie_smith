const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectData = require('./config/data')
const routes = require('./src/routes')
const cookieParser = require('cookie-parser')
const app = express()
const path = require('path')

const port = process.env.PORT || 5000

// config dotenv
dotenv.config()

app.use(express.static(path.join(__dirname, 'public')))
// use morgan, cors, json
app.use(morgan('common'))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// connect data
connectData()

// routes
app.use('/api', routes)

// run server
app.listen(port, () => console.log('Server is running....' + port))
