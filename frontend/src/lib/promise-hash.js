// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

function promiseHash(hash: { [any]: Promise<*> }): { [any]: any } {
  let keys = [], values = []

  for (let key in hash) {
    keys.push(key)
    values.push(hash[key])
  }

  function reducer(arr) {
    return function(acc, curr, idx) {
      acc[curr] = arr[idx]
      return acc
    }
  }

  return Promise.all(values).then(results => {
    return keys.reduce(reducer(results), {})
  })
}

export default promiseHash
