const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'Category', default: null
    }
})

const Category = mongoose.model('Category',schema)

module.exports = Category