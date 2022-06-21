const mongoose = require('mongoose')

async function connectData() {
    try {
        await mongoose.connect(process.env.URL_MONGOOSE)
        console.log('Connect data successfully!!')
    } catch (error) {
        console.log('Connect data failed!!')
    }
}

module.exports = connectData
