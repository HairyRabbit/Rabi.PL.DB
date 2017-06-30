import randomString from '../random-string'

test('Generate a six length random string.', () => {
  expect(randomString(6).length).toBe(6)
})
