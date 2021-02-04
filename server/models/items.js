const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
})

const Category = mongoose.model('Item',schema)

module.exports = Category