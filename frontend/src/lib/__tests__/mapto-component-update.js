import update from '../mapto-component-update'

test('mapComponentUpdate unpack the action.', () => {
  const model = {
    bar: 42
  }
  const action = {
    type: 'foo/bar/baz',
    _type: 'foobar'
  }
  const namespace = 'foo'
  const component = {
    update: (m, act) => (act.type === 'foobar' ? 1 : m)
  }
  expect(update(model, action, namespace)(component)).toEqual({
    bar: 1
  })
})
