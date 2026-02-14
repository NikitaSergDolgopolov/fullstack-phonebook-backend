const { test, describe } = require('node:test')
const assert = require('node:assert')

// const reverse = require('./testing').reverse

const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}


describe('reverse', () => {
  test('reverse of a', () => {
  const result = reverse('a')

  assert.strictEqual(result, 'a')
  })

  test('reverse of react', () => {
    const result = reverse('react')

    assert.strictEqual(result, 'tcaer')
  })

  test('reverse of saippuakauppias', () => {
    const result = reverse('saippuakauppias')

    assert.strictEqual(result, 'saippuakauppias')
  })
})