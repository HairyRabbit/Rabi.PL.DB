import configureMockStore from 'redux-mock-store'
import { Change } from '../types'
import { initModel, update, onChange } from '../state'

/// Update

describe('test update', () => {
  it('should return init model', () => {
    expect(update()).toEqual(initModel)
  })

  it('should change value', () => {
    expect(
      update(initModel, {
        type: Change,
        payload: 'foo'
      })
    ).toEqual({
      value: 'foo'
    })
  })
})

/// Action

describe('test action', () => {
  // configure store

  const mockStore = configureMockStore()

  const store = mockStore(initModel)

  it('action should change value', () => {
    store.dispatch(onChange('foo'))

    expect(store.getActions()).toEqual([{ type: Change, payload: 'foo' }])
  })
})
