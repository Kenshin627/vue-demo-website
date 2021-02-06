const mongoose  = require('mongoose')
const multer = require('multer')
const upload = multer({dest: __dirname + '/../../uploads/ads'}) 

module.exports = app => {
  const express = require('express'),
        router = express.Router(),
        Ads = require('../../models/ads'),
        baseUrl = '/api/admin',
        path = '/ads'

    //create
    router.post(path,async (req,res) => {
        const { err } = await Ads.create(req.body)
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
        const { err } = await Ads.findByIdAndRemove(req.params.id)
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
        const data  = await Ads.findByIdAndUpdate(req.body._id, req.body)
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
        const data = await Ads.findById(req.params.id)
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
            p1 = Ads.countDocuments(),
            reg = new RegExp(req.query.name,'i')
            p2 = Ads.find({ name: { $regex: reg } }).skip((page - 1) * count).limit(count)
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
        const { err } = await Ads.deleteMany({ _id: { $in: ids } })
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
        file.url = `http://localhost:3001/uploads/ads/${ file.filename }`
        res.send(file)
    })
    
    app.use(baseUrl,router)
}
