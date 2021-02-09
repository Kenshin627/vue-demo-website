module.exports = app => {
  const express = require('express'),
        router = express.Router(),
        baseUrl = '/api/admin/:resource',
        mongoose  = require('mongoose'),
        multer = require('multer'),
        bcrypt = require('bcrypt'),
        jwt = require('jsonwebtoken'),
        tokenPrivateKey = app.get('tokenPrivateKey'),
        authMiddleware = require('../../middleware/authrizationMiddleWare'),
        classifyModelMiddleware = require('../../middleware/classifyModelMiddleware'),
        imageUpload = multer({ dest: __dirname + '/../../uploads/' }),
        uploadUrlPrefix = 'http://localhost:3001/uploads/'

    //create
    router.post('',authMiddleware() , async (req,res) => {
        const model = require(`../../models/${ req.Model }`)
        await model.create(req.body)
        res.send({
            code: 1,
            text: '创建成功'
        })
    })
    //delete
    router.delete('/:id', authMiddleware(), async (req,res) => {
        const model = require(`../../models/${ req.Model }`)
        await model.findByIdAndRemove(req.params.id)
        res.send({
            code: 1,
            text: '删除成功'
        })
    })
    //edit
    router.put('',authMiddleware() ,async (req,res) => {
        const model = require(`../../models/${ req.Model }`)
        await model.findByIdAndUpdate(req.body._id, req.body)
        res.send({
            code: 1,
            text: '更新成功'
        })
    })
    //getById
    router.get('/:id',authMiddleware(),async (req, res) => {
        const model = require(`../../models/${ req.Model }`)
        const data = await model.findById(req.params.id)
        res.send({
            code: 1,
            text: '获取成功',
            data
        })
    })
    //list
    router.get('', authMiddleware(), (req,res) => {
            let page = parseInt(req.query.num),
            count = parseInt(req.query.size),
            getRoot = parseInt(req.query.getRoot),
            model = require(`../../models/${ req.Model }`)
            reg = new RegExp(req.query.name,'i'),
            getAll = parseInt(req.query.getAll),
            p1 = model.countDocuments(),
            querySelector = (req.Model === 'AdminUser')?{ username:  { $regex: reg } } : { name: { $regex: reg } },
            p2 = null
            if(getAll === 1){
                p2 = model.find({})
            }else{
                if(getRoot === 1){
                    p2 = model.find({ 'parent': null })
                }else{
                    const resource = req.baseUrl.split('/')[2]
                    switch (resource) {
                        case 'heros':
                            p2 = Hero.find({ name: { $regex: reg } }).populate('categories').skip((page - 1) * count).limit(count)
                            break;
                        case 'categories':
                            p2 = p2 = Category.find({ name: { $regex: reg } }).populate('parent').sort({ parent: 1}).skip((page - 1) * count).limit(count)
                        default:
                            p2 = model.find(querySelector).skip((page - 1) * count).limit(count)
                            break;
                    }
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
            })
    })
    //getChildrenCategories
    router.get('/children/:parentName', async (req,res) => {
        const parentName = req.params.parentName
        const reg = new RegExp(parentName,'i')
        const model = require(`../../models/${ req.Model }`)
        const parent = await model.findOne({ name : { $regex: reg } })
        const children = await model.find({ parent: parent._id })
        res.send({
            code: 1,
            text: '获取成功',
            listData: children
        })
    })
    //deleteMany
    router.post('/deleteMany',authMiddleware(), async (req,res) => {
        const ids = req.body.ids.map( id => {
            return mongoose.Types.ObjectId(id)
        })
        const model = require(`../../models/${ req.Model }`)
        await model.deleteMany({ _id: { $in: ids } })
        res.send({
            code: 1,
            text: '删除成功'
        })
    })
    //upload
    router.post('/upload/', authMiddleware(), imageUpload.single('file'), async (req,res) => {
        let file = req.file
        file.url = `${ uploadUrlPrefix }${ file.filename }`
        res.send(file)
    })
    //login
    app.post('/api/admin/login',async (req, res) => {
        const { username, password } = req.body
              findUser = await require('../../models/AdminUser').findOne({ username }).select("+password")
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

    app.use(baseUrl,classifyModelMiddleware(),router)
    app.use((err,req,res,next) => {
        res.status(err.statusCode).send({
            message: err.message
        })
    })
}
