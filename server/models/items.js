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

const Item = mongoose.model('Item',schema)

module.exports = Item