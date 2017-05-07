let jsonwebtoken = require('jsonwebtoken')
let express = require('express')
let router = express.Router()
let express_jwt = require('express-jwt')
let impl = require('./db-router-impl')

let key = 'rabbit and pl hold the key'
let global_connection_dict = {}

router.get('/hello', function (req, res) {
    res.send('world')
})

router.get('/helloj', function (req, res) {
    res.json({j: 'j'})
})

router.use(express_jwt({secret: key}).unless({path: ['/connect']}))

router.get('/connect', function (req, res) {
    let {host, port, user, pass, database, ssl} = req.query
    impl.connect(
        host, port, user, pass, database, ssl
    ).then((connection) => {
        let payload = {
            k: '' + Math.random()
        }
        global_connection_dict[payload.k] = connection
        let connection_token = jsonwebtoken.sign(payload, key)
        res.json({token: connection_token})
    }).catch((err) => {
        console.log(err)
        res.json({err})
    })
})

router.get('/end', (req, res) => {
    let connection_key = req.user.k
    let connection = global_connection_dict[connection_key]
    connection.end()
    delete global_connection_dict[connection_key]
    res.end()
})

router.get('/database', (req, res) => {
    let connection = global_connection_dict[req.user.k]
    connection.query('show databases', (err, rows, fields) => {
        if (err) {
            res.json({err})
        } else {
            res.json({fields, rows})
        }
    })
})

router.get('/table', (req, res) => {
    let connection = global_connection_dict[req.user.k]
    connection.query('show tables', (err, rows, fields) => {
        if (err) {
            res.json({err})
        } else {
            res.json({fields, rows})
        }
    })
})


module.exports = router

