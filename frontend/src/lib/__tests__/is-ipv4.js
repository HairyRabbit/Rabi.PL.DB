import ipv4 from '../is-ipv4'

test('should be true', () => {
  expect(ipv4('0.0.0.0')).toBe(true)
})

test('should be false', () => {
  expect(ipv4('foo')).toBe(false)
})

test('should be false', () => {
  expect(ipv4('255.255.255.256')).toBe(false)
})
