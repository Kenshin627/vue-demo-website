const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category'}]
})

const Article = mongoose.model('Article',schema)

module.exports = Article