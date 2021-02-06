const mongoose = require('mongoose')
const ads = new mongoose.Schema({
    name: { type: String },
    items: [{
        photo: { type: String },
        link: { type: String }
    }]
})

module.exports = mongoose.model('Ads',ads)