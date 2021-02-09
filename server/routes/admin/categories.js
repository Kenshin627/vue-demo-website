const mongoose  = require('mongoose')

module.exports = app => {
    const express = require('express'),
        router = express.Router(),
        Category = require('../../models/categories'),
        baseUrl = '/api/admin',
        path = '/categories'

    //list
    router.get(path, (req,res) => {
        let page = parseInt(req.query.num),
            count = parseInt(req.query.size),
            getRoot = parseInt(req.query.getRoot),
            p1 = Category.countDocuments(),
            p2 = null,
            reg = new RegExp(req.query.name,'i')
            if(getRoot === 1){
                p2 = Category.find({ 'parent': null })
            }else{
                p2 = Category.find({ name: { $regex: reg } }).populate('parent').sort({ parent: 1}).skip((page - 1) * count).limit(count)
            }
        
        Promise.all([p1,p2])
        .then( ([count,list]) => {
            res.send({
                code: 1,
                text: '获取成功',
                count,
                listData: list
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                code: 0,
                text: "获取失败"
            })
        })
    })


    router.get(path + '/children/:parentName', async (req,res) => {
        const parentName = req.params.parentName
        const reg = new RegExp(parentName,'i')
        const parent = await Category.findOne({ name : { $regex: reg } })
        const children = await Category.find({ parent: parent._id })
        res.send({
            code: 1,
            text: '获取成功',
            listData: children
        })
    })
    app.use(baseUrl,router)
}
