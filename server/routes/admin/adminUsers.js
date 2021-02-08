module.exports = app => {
  const express = require('express'),
        router = express.Router(),
        adminUsers = require('../../models/adminUsers'),
        baseUrl = '/api/admin',
        path = '/adminUsers',
        mongoose  = require('mongoose'),
        multer = require('multer'),
        bcrypt = require('bcrypt'),
        jwt = require('jsonwebtoken'),
        upload = multer({dest: __dirname + '/../../uploads/adminUsers'}),
        tokenPrivateKey = app.get('tokenPrivateKey'),
        authMiddleware = require('../../middleware/authrizationMiddleWare')

    //create
    router.post(path,async (req,res) => {
        const { err } = await adminUsers.create(req.body)
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
        const { err } = await adminUsers.findByIdAndRemove(req.params.id)
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
        const data  = await adminUsers.findByIdAndUpdate(req.body._id, req.body)
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
        const data = await adminUsers.findById(req.params.id)
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
    router.get(path, authMiddleware(), (req,res) => {
        let page = parseInt(req.query.num),
            count = parseInt(req.query.size),
            reg = new RegExp(req.query.name,'i'),
            p1 = adminUsers.countDocuments(),
            p2 = adminUsers.find({ username: { $regex: reg } }).skip((page - 1) * count).limit(count)
        
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
    //deleteMany
    router.post(path+'/deleteMany', async (req,res) => {
        const ids = req.body.ids.map( id => {
            return mongoose.Types.ObjectId(id)
        })
        const { err } = await adminUsers.deleteMany({ _id: { $in: ids } })
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
    //upload
    router.post(path + '/upload/', upload.single('file'), async (req,res) => {
        let file = req.file
        file.url = `http://localhost:3001/uploads/adminUsers/${ file.filename }`
        res.send(file)
    })
    //login
    app.post('/api/admin/login',async (req, res) => {
        const { username, password } = req.body
              findUser = await adminUsers.findOne({ username }).select("+password")
              console.log(findUser)
        if(!findUser) {
            return res.status(422).send({
                code: 0,
                text: '未找到用户'
            })
        }else{
            try {
                const ret = await bcrypt.compare(password,findUser.password)
                if(ret){
                    const token = jwt.sign({ id: findUser._id },tokenPrivateKey)
                    console.log(token)
                    res.send({
                        code: 1,
                        text: '登录成功',
                        data: {
                            token,
                            user: findUser
                        }
                    })
                }else{
                    res.status(422).send({
                        code: 0,
                        text: '密码错误'
                    })
                }
            } catch (error) {
                return res.status(500).send({
                    code: 0,
                    text: '内部错误'
                })
            }
        }
    })

    app.use(baseUrl,router)
    app.use((err,req,res,next) => {
        res.status(err.statusCode).send({
            message: err.message
        })
    })
}
