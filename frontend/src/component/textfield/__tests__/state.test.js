// -*- mode: js -*-
// -*- coding: utf-8 -*-

import configureMockStore from 'redux-mock-store'
import { ChangeValue, TurnActive, ToggleList } from '../types'
import {
  initModel,
  initAutoComplete,
  update,
  change,
  turn,
  toggle
} from '../state'

/// UPDATE

describe('test update Change', () => {
  it('should change value.', () => {
    expect(
      update(initModel, {
        type: ChangeValue,
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
        type: ChangeValue,
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
          { value: 'bar', active: true },
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
        type: ChangeValue,
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

describe('test update toggle visibility', () => {
  it('should copy list to display when visible and blank value.', () => {
    const model = {
      ...initModel,
      autocomplete: {
        ...initAutoComplete,
        list: ['foo', 'bar', 'baz']
      }
    }

    expect(
      update(model, {
        type: ToggleList,
        payload: {
          decode: x => x,
          visibility: true
        }
      })
    ).toEqual({
      ...model,
      autocomplete: {
        ...model.autocomplete,
        display: [
          { value: 'bar', active: true },
          { value: 'baz', active: false },
          { value: 'foo', active: false }
        ]
      }
    })
  })

  it('should match list to display when visible and value not blank.', () => {
    const model = {
      ...initModel,
      value: 'ba',
      autocomplete: {
        ...initAutoComplete,
        list: ['foo', 'bar', 'baz']
      }
    }

    expect(
      update(model, {
        type: ToggleList,
        payload: {
          decode: x => x,
          visibility: true
        }
      })
    ).toEqual({
      ...model,
      autocomplete: {
        ...model.autocomplete,
        display: [
          { value: 'bar', active: true },
          { value: 'baz', active: false }
        ]
      }
    })
  })

  it('should clear list when hidden.', () => {
    const model = {
      ...initModel,
      value: 'ba',
      autocomplete: {
        ...initAutoComplete,
        list: ['foo', 'bar', 'baz']
      }
    }

    expect(
      update(model, {
        type: ToggleList,
        payload: {
          decode: x => x,
          visibility: false
        }
      })
    ).toEqual({
      ...model,
      autocomplete: {
        ...model.autocomplete,
        display: []
      }
    })
  })
})

/// ACTION

describe('test action change value', () => {
  const mockStore = configureMockStore()
  const store = mockStore(initModel)

  it('should change value.', () => {
    store.dispatch(change('foo'))

    expect(store.getActions()).toEqual([
      { type: ChangeValue, payload: { value: 'foo' } }
    ])
  })
})

describe('test action turn active', () => {
  const mockStore = configureMockStore()
  const store = mockStore(initModel)

  it('should turn actived.', () => {
    store.dispatch(turn(1))

    expect(store.getActions()).toEqual([
      { type: TurnActive, payload: { direction: 1 } }
    ])
  })
})

describe('test action toggle visibility', () => {
  const mockStore = configureMockStore()
  const store = mockStore(initModel)

  it('should toggle visibility.', () => {
    store.dispatch(toggle(true))

    expect(store.getActions()).toEqual([
      { type: ToggleList, payload: { visibility: true } }
    ])
  })
})
