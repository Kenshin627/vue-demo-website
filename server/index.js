const { json } = require('express');
const express = require('express'),
      cors = require('cors')
      
let app = express();
app.use(cors());
app.use(json());

require('./plugins/mongodb')(app)
require('./routes/admin/categories')(app)

app.listen("3001",_ => {
    console.log('server has been start as port 3001')
})


