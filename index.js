
var express = require('express')
var app = express()

let db_router = require('./db-router.js')

app.use('/', db_router)

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
