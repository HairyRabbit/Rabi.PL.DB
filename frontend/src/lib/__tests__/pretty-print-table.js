import print from '../pretty-print-table'

test('shoud print table', () => {
  expect(
    print(`\
| foo | bar |
| 42222222222  | fooooooooooooooo |
`)
  ).toBe(`\
| foo         | bar              |
| 42222222222 | fooooooooooooooo |\
`)
})

test('shoud print only one col', () => {
  expect(
    print(`\
| foo |
| 42 |
`)
  ).toBe(`\
| foo |
| 42  |\
`)
})

test('shoud print only one line', () => {
  expect(
    print(`\
| foo |
`)
  ).toBe(`\
| foo |\
`)
})

test('shoud warpped word', () => {
  expect(print(`foo`)).toBe(`| foo |`)
})
