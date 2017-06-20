import action from '../mapto-component-action'

test('mapComponentAction package actions.', () => {
  const namespace = 'foo'
  const componentName = 'bar'
  const actions = {
    foo1: () => ({
      type: 'foo1-type'
    }),
    foo2: () => ({
      type: 'foo2-type'
    }),
    bar1: () => dispatch => {
      dispatch({ type: 'bar1-type' })
    }
  }

  const action1 = {
    ['foo/bar/foo1']: () => ({
      type: 'foo/bar/foo1',
      _type: 'foo1-type'
    }),
    ['foo/bar/foo2']: () => ({
      type: 'foo/bar/foo2',
      _type: 'foo2-type'
    }),
    ['foo/bar/bar1']: () => dispatch => {
      dispatch({
        type: 'foo/bar/bar1',
        _type: 'bar1-type'
      })
    }
  }

  const act = action(actions, componentName, namespace)
  const mockDispatch = jest.fn(act => act)

  function fire(fn) {
    const fn1 = fn()
    if (typeof fn1 !== 'function') return fn1
    return fn1(mockDispatch)
  }

  expect(Object.keys(act)).toEqual(Object.keys(action1))
  expect(Object.values(act).map(fire)).toEqual(Object.values(action1).map(fire))
})
