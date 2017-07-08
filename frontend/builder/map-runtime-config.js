// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * map-runtime-config
 *
 * Write config to runtime by `DefinePlugin`.
 *
 * TODO webapck need recomplile when config file was changed.
 */

import get from 'lodash/get'

function mapRuntimeConfig(configs: Object): Object {
  function filter(key: string): boolean {
    return Boolean(configs[key].runtime)
  }

  function folder(acc: Object, key: string): Object {
    const config: Object = configs[key]
    const runtime: Array<string> = config.runtime
    if (runtime.length !== 0) {
      runtime.forEach(path => {
        const prop: string =
          'process.env.' +
          [key, path].join('.').replace(/\./g, '_').toUpperCase()
        const value: string = JSON.stringify(get(config, path))

        acc[prop] = value
      })
    }

    return acc
  }

  return Object.keys(configs).filter(filter).reduce(folder, {})
}

export default mapRuntimeConfig
