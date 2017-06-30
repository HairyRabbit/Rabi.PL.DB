import makeJsonpScript from '../make-jsonp-script'

test('source with protocol', () => {
  expect(makeJsonpScript('foo://bar').src).toBe('foo://bar')
})

test('source without protocol', () => {
  expect(makeJsonpScript('bar').src).toBe('http://bar/')
})

test('protocol is true', () => {
  expect(makeJsonpScript('bar', true).src).toBe('https://bar/')
})
