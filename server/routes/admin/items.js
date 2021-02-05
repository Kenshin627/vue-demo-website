const mongoose  = require('mongoose')
const multer = require('multer')
const upload = multer({dest: __dirname + '/../../uploads/items'}) 

module.exports = app => {
    const express = require('express'),
        router = express.Router(),
        Item = require('../../models/items'),
        baseUrl = '/api/admin',
        path = '/items'

    //create
    router.post(path,async (req,res) => {
        const { err } = await Item.create(req.body)
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
        const { err } = await Item.findByIdAndRemove(req.params.id)
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
        const data  = await Item.findByIdAndUpdate(req.body._id, req.body)
        if(!data) {
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
        const data = await Item.findById(req.params.id)
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
    router.get(path, (req,res) => {
        let page = parseInt(req.query.num),
            count = parseInt(req.query.size),
            getRoot = parseInt(req.query.getRoot),
            getAll = parseInt(req.query.getAll)
            // name = req.query.name? req.query.name : '',
            p1 = Item.countDocuments(),
            p2 = null,
            reg = new RegExp(req.query.name,'i')
            if(getAll === 1) {
                p2 = Item.find({})
            }else{
                if(getRoot === 1){
                    p2 = Item.find({ 'parent': null })
                }else{
                    p2 = Item.find({ name: { $regex: reg } }).skip((page - 1) * count).limit(count)
                }
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

    router.post(path+'/deleteMany', async (req,res) => {
        const ids = req.body.ids.map( id => {
            return mongoose.Types.ObjectId(id)
        })
        const { err } = await Item.deleteMany({ _id: { $in: ids } })
        console.log(err)
        if(err) {
            res.status(500).send({
                code: 0,
                text: "删除失败"
            })
        }else{
            res.send({
                code: 1,
                text: '删除成功'
            })
        }
    })
    router.post(path + '/upload/', upload.single('file'), async (req,res) => {
        let file = req.file
        file.url = `http://localhost:3001/uploads/items/${ file.filename }`
        res.send(file)
    })
    
    app.use(baseUrl,router)
}
