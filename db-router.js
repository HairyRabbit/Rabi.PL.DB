let mysql = require('mysql')
let jsonwebtoken = require('jsonwebtoken')
let express = require('express')
let router = express.Router()
let express_jwt = require('express-jwt')

let key = 'rabbit and pl hold the key'
let global_connection_dict = {}


router.use(express_jwt({secret: key}).unless({path: ['/connect']}))

router.get('/connect', function (req, res) {
    let {host, port, user, pass, database, ssl} = req.query
    Promise.resolve(
    ).then(function () {
        let connection = mysql.createConnection({
            host, port, user, database,
            password: pass
            // TODO: ssl
        })
        return new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (!err) {
                    resolve(connection)
                } else {
                    reject(err)
                }
            })
        })
    }).then((connection) => {
        let payload = {
            r: Math.random()
        }
        let connection_token = jsonwebtoken.sign(payload, key)
        global_connection_dict[connection_token] = connection
        res.json({token: connection_token})
    }).catch((err) => {
        console.log(err)
        res.json({err})
    })
})

module.exports = router
