const Category = require('../../models/categories')

module.exports = app => {
    const express = require('express'),
        router = express.Router(),
        Category = require('../../models/categories'),
        baseUrl = '/api/admin',
        path = '/categories'

    //create
    router.post(path,async (req,res) => {
        const { err } = await Category.create(req.body)
        if(err) {
            res.status(500).send({
                code: 0,
                text: '创建失败'
            })
        }else{
            res.send({
                code: 1,
                text: '创建成功'
            })
        }
    })
    //delete
    router.delete(path+'/:id',async (req,res) => {
        const { err } = await Category.findByIdAndRemove(req.params.id)
        if(err) {
            res.status(500).send({
                code: 0,
                text: '删除失败'
            })
        }else{
            res.send({
                code: 1,
                text: '删除成功'
            })
        }
    })
    //edit
    router.put(path, async (req,res) => {
        const { err } = await Category.findByIdAndUpdate(req._id, req.body)
        if(err) {
            res.status(500).send({
                code: 0,
                text: '更新失败'
            })
        }else{
            res.send({
                code: 1,
                text: '更新成功'
            })
        }
    })
    //getById
    router.get(path+'/:id',async (req, res) => {
        const data = await Category.findById(req.params.id)
        if(!data) {
            res.status(500).send({
                code: 0,
                text: '获取失败'
            })
        }else{
            res.send({
                code: 1,
                text: '获取成功',
                data
            })
        }
    })
    //list
    router.get(path, async (req,res) => {
        let page = parseInt(req.query.num),
            count = parseInt(req.query.size),
            p1 = Category.countDocuments(),
            p2 = Category.find().skip((page - 1) * count).limit(count)
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

    router.post(path+'/deleteMany', async (req,res) => {
        const { ids } = req.body
        console.log(ids)
        const { err } = await Category.deleteMany()
        console.log(err)
    })
    app.use(baseUrl,router)
}
