const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String,
        select: false,
        set(val) {
            return bcrypt.hashSync(val,10)
        }
    },
    avator: {
        type: String
    }
})
module.exports = mongoose.model('AdminUser',schema) 