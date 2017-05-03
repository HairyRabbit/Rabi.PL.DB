import configureMockStore from 'redux-mock-store'
import thunk              from 'redux-thunk'
import nock               from 'nock'
import fetch              from 'isomorphic-fetch'

import {
  Connect,
  ConnectSuccess,
  ConnectFailure
} from '../types'

import {
  initConnectObject,
  initModel,
  update,
  connect
} from '../state'



/// Update


describe('test welcome page update', () => {
  it('should return init model', () => {
    expect(
      update()
    ).toEqual(initModel)
  })

  it('should begin connect', () => {
    expect(
      update(initModel, {
        type: Connect
      })
    ).toEqual({
      connecting: true,
      connected: false,
      error: null,
      connect: initConnectObject
    })
  })

  it('should connect succeed', () => {
    expect(
      update(initModel, {
        type: ConnectSuccess
      })
    ).toEqual({
      connecting: false,
      connected: true,
      error: null,
      connect: initConnectObject
    })
  })

  it('should connect failed', () => {

    const error = {
      code: 42,
      message: 'foo'
    }
    
    expect(
      update(initModel, {
        type: ConnectFailure,
        payload: error
      })
    ).toEqual({
      connecting: false,
      connected: true,
      error: error,
      connect: initConnectObject
    })
  })
})



/// Action


describe('test welcome page actions', () => {

  // configure store

  const mockStore = configureMockStore([
    thunk
  ])

  const store = mockStore(initModel)

  // configure request

  afterEach(() => {
    nock.cleanAll()
  })

  const connObj = initConnectObject
  
  it('action should connect succeed', () => {

    nock('http://localhost/api/v1').get('/connect').reply(200, {
      body: {}
    })
    
    return store.dispatch(connect(initConnectObject))
      .then(() => {
        expect(
          store.getActions()
        ).toEqual([
          { type: Connect },
          { type: ConnectSuccess, payload: null }
        ])
      })
  })

  it('action should connect failed', () => {

    const errObj = {
      code: 1405,
      message: `Access denied for user 'ODBC'@'localhost' (using password: NO)`
    }

    nock('http://localhost/api/v1').get('/connect').reply(400, {
      body: errObj
    })
    
    return store.dispatch(connect(initConnectObject))
      .catch(() => {
        expect(
          store.getActions()
        ).toEqual([
          { type: Connect },
          { type: ConnectFailure, payload: errObj }
        ])
      })
  })
})


