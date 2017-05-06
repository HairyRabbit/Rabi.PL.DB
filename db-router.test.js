let impl = require('./db-router-impl')


test('hello Promise', done => {
    Promise.resolve('lemon').then(edible => {
        expect(edible).toEqual('lemon')
        done()
    })
})

test('connect mysql good', done => {
    impl.connect(
        '127.0.0.1', '3306',
        'root', '',
        'mysql', 'TODO'
    ).then(connection => {
        expect(connection).toBeDefined()
        connection.end()
        done()
    })
})

test('connect mysql badpass', done => {
    impl.connect(
        '127.0.0.1', '3306',
        'root', '******',
        'mysql', 'TODO'
    ).catch(err => {
        expect(err).toBeDefined()
        done()
    })
})
