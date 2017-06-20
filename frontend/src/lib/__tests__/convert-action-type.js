import { encode, decode } from '../convert-action-type'

test('encode values', () => {
  expect(encode('foo', 'bar', 'baz')).toBe('foo/bar/baz')
})

test('decode values', () => {
  expect(decode('foo/bar/baz')).toEqual(['foo', 'bar', 'baz'])
})
