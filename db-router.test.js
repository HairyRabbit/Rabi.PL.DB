let impl = require('./db-router-impl')
let dbr = require('./db-router')


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

test('dbr router has handle', () => {
    expect(dbr.handle).toBeDefined()
})

test('dbr router hello', () => {
    dbr.handle({url: '/hello', method: 'GET'}, {send: function (v) {
        expect(v).toEqual('world')
    }})
})

test('test helloj', () => {
    dbr.handle({url: '/helloj', method: 'GET'}, {json: function (v) {
        expect(v.j).toBeDefined()
    }})
})


let auth_headers


beforeAll(() => {
    let query = {
        host: '127.0.0.1', port: 3306,
        user: 'root', pass: '',
        database: 'mysql',
        ssl: 'disabled'
    }

    dbr.handle({url: '/connect', query, method: 'GET'}, {json (v) {
        auth_headers = {authorization: 'Bearer ' + v.token}
        expect(v.token).toBeDefined()
    }})
})

afterAll(() => {
    dbr.handle({url: '/end', method: 'GET', headers: auth_headers}, {end () {
        expect(1).toBeDefined()
    }})
})


