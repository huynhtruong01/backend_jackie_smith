const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(Number.parseInt(process.env.NUMBER_SALT))
        const passwordHashed = await bcrypt.hash(password, salt)
        return passwordHashed
    } catch (error) {
        throw new Error({ error: error })
    }
}

const comparePassword = async (password, passwordHashed) => {
    try {
        if (!password || !passwordHashed) throw new Error('Not have password or password hashed')
        const isEqual = await bcrypt.compare(password, passwordHashed)

        return isEqual
    } catch (error) {
        throw new Error(error)
    }
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
}

module.exports = {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
}
