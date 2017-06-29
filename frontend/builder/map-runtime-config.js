// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * map-runtime-config
 *
 * Write config to runtime by `DefinePlugin`
 */

import isPlainObject from 'lodash/isPlainObject'

function mapRuntimeConfig(configs) {
  let acc = {}

  function makeKey(path, key) {
    return path === '' ? key.toUpperCase() : [path, key].join('_').toUpperCase()
  }

  function recur(path, obj) {
    const keys = Object.keys(obj)
    if (keys.indexOf('runtime') !== -1) {
      keys.forEach(key => {
        const pathkey = makeKey(path, key)
        const val = obj[key]
        if (key !== 'runtime' && !isPlainObject(val)) {
          acc[pathkey] = JSON.stringify(val)
        } else {
          recur(pathkey, val)
        }
      })
    } else {
      keys.forEach(key => {
        var pathkey = makeKey(path, key)
        const val = obj[key]
        if (isPlainObject(val)) {
          recur(pathkey, val)
        }
      })
    }
  }

  recur('', configs)

  return acc
}

export default mapRuntimeConfig
