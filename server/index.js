const { json } = require('express'),
      express = require('express'),
      cors = require('cors')
      tokenPrivateKey = `asda182317237!~#`
let app = express()
app.set('tokenPrivateKey',tokenPrivateKey)
app.use(cors())
app.use(json())
app.use('/uploads/',express.static(__dirname + '/uploads/'))

require('./plugins/mongodb')(app)
require('./routes/admin/modelOperator')(app)

app.listen("3001",_ => {
    console.log('server has been start as port 3001')
})


