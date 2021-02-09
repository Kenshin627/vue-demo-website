const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    avator: {
        type: String
    },
    description: {
        type: String
    },
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
    scores: {
         difficult: {
            type: Number
        },
        skill: {
            type: Number
        },
        attack: {
            type: Number
        },
        survive: {
            type: Number
        }
    },
    item1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
    item2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
    usageTips: { type: String },
    battleTips: { type: String },
    teamTips: { type: String },
    partners: [{
      hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
      description: { type: String }
    }],
    enemies: [{
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
        description: { type: String }
    }],
    skills: [{
        name: { type: String },
        description: { type: String },
        photo: { type: String },
        tips: { type: String },
        coldDown: {type: Number },
        consume: { type: Number },
        isUlt: { type: Boolean }
    }]
})

module.exports = mongoose.model('Hero',schema)