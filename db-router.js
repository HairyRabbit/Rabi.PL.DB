let jsonwebtoken = require('jsonwebtoken')
let express = require('express')
let router = express.Router()
let express_jwt = require('express-jwt')
let impl = require('./db-router-impl')

let key = 'rabbit and pl hold the key'
let global_connection_dict = {}


router.use(express_jwt({secret: key}).unless({path: ['/connect']}))

router.get('/connect', function (req, res) {
    let {host, port, user, pass, database, ssl} = req.query
    impl.connect(
        host, port, user, pass, database, ssl
    ).then((connection) => {
        let payload = {
            r: Math.random()
        }
        let connection_token = jsonwebtoken.sign(payload, key)
        global_connection_dict[connection_token] = connection
        res.json({token: connection_token})
        console.log(connection)
    }).catch((err) => {
        console.log(err)
        res.json({err})
    })
})

module.exports = router

