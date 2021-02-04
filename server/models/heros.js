const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    avator: {
        type: String
    }
})

module.exports = mongoose.model('Hero',schema)