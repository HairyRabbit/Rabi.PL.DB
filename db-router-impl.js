let mysql = require('mysql')

module.exports = {
    connect (host, port, user, pass, database, ssl) {
        return Promise.resolve(
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
        })
    }
}
