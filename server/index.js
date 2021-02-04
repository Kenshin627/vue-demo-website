const { json } = require('express');
const express = require('express'),
      cors = require('cors')
      
let app = express();
app.use(cors());
app.use(json());
app.use('/uploads/items',express.static(__dirname + '/uploads/items'))

require('./plugins/mongodb')(app)
require('./routes/admin/categories')(app)
require('./routes/admin/items')(app)

app.listen("3001",_ => {
    console.log('server has been start as port 3001')
})


