const mongoose = require('mongoose')

module.exports = app => {
    mongoose.connect("mongodb://localhost/vueDemoWeb",{
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
}