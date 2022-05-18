const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(Number.parseInt(process.env.NUMBER_SALT))
        const passwordHashed = await bcrypt.hash(password, salt)
        return passwordHashed
    } catch (error) {
        throw new Error({ error: error })
    }
}

module.exports = {
    hashPassword,
}
