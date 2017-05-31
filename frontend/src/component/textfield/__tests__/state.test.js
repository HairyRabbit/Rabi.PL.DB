import configureMockStore from 'redux-mock-store'
import { Change, TurnActive } from '../types'
import { initModel, initAutoComplete, update, onChange } from '../state'

/// Update

describe('test update Change', () => {
  it('should change value.', () => {
    expect(
      update(initModel, {
        type: Change,
        payload: {
          value: 'foo'
        }
      })
    ).toEqual({
      ...initModel,
      value: 'foo'
    })
  })

  it('should matched value.', () => {
    const model = {
      ...initModel,
      autocomplete: {
        ...initAutoComplete,
        list: ['foo', 'bar', 'baz']
      }
    }

    expect(
      update(model, {
        type: Change,
        payload: {
          value: 'b',
          decode: x => x
        }
      })
    ).toEqual({
      ...model,
      value: 'b',
      autocomplete: {
        ...model.autocomplete,
        display: [
          { value: 'bar', active: false },
          { value: 'baz', active: false }
        ]
      }
    })
  })

  it('should no display with a empty list.', () => {
    const model = {
      ...initModel,
      autocomplete: {
        ...initAutoComplete,
        list: []
      }
    }

    expect(
      update(model, {
        type: Change,
        payload: {
          value: 'b',
          decode: x => x
        }
      })
    ).toEqual({
      ...model,
      value: 'b',
      autocomplete: {
        ...model.autocomplete
      }
    })
  })
})

describe('test update TurnActive', () => {
  const step1 = {
    ...initModel,
    autocomplete: {
      ...initAutoComplete,
      list: ['foo', 'bar', 'baz'],
      display: [
        { value: 'bar', active: false },
        { value: 'baz', active: false }
      ]
    }
  }
  const step2 = {
    ...initModel,
    autocomplete: {
      ...initAutoComplete,
      list: ['foo', 'bar', 'baz'],
      display: [{ value: 'bar', active: true }, { value: 'baz', active: false }]
    }
  }
  const step3 = {
    ...initModel,
    autocomplete: {
      ...initAutoComplete,
      list: ['foo', 'bar', 'baz'],
      display: [{ value: 'bar', active: false }, { value: 'baz', active: true }]
    }
  }

  it('should no changed when display list is empty.', () => {
    const model = {
      ...initModel,
      autocomplete: {
        ...initAutoComplete,
        list: ['foo', 'bar', 'baz'],
        display: []
      }
    }
    expect(
      update(model, {
        type: TurnActive,
        payload: {
          direction: 1
        }
      })
    ).toEqual(model)
  })

  it('should always true when display list has only one item.', () => {
    const model = {
      ...initModel,
      autocomplete: {
        ...initAutoComplete,
        list: ['foo', 'bar', 'baz'],
        display: [{ value: 'foo', active: false }]
      }
    }
    expect(
      update(model, {
        type: TurnActive,
        payload: {
          direction: 1
        }
      })
    ).toEqual({
      ...model,
      autocomplete: {
        ...model.autocomplete,
        display: [{ value: 'foo', active: true }]
      }
    })
  })

  it('should actived with 1st item.', () => {
    expect(
      update(step1, {
        type: TurnActive,
        payload: {
          direction: 1
        }
      })
    ).toEqual(step2)
  })

  it('should actived with 2nd item.', () => {
    expect(
      update(step2, {
        type: TurnActive,
        payload: {
          direction: 1
        }
      })
    ).toEqual(step3)
  })

  it('should actived with 1st item angin.', () => {
    expect(
      update(step3, {
        type: TurnActive,
        payload: {
          direction: 1
        }
      })
    ).toEqual(step2)
  })

  it('should actived with 2nd if dir is reversed.', () => {
    expect(
      update(step1, {
        type: TurnActive,
        payload: {
          direction: -1
        }
      })
    ).toEqual(step3)
  })
})

/// Action

describe('test action', () => {
  // configure store

  const mockStore = configureMockStore()

  const store = mockStore(initModel)

  it('action should change value', () => {
    store.dispatch(onChange('foo'))

    expect(store.getActions()).toEqual([
      { type: Change, payload: { value: 'foo' } }
    ])
  })
})
