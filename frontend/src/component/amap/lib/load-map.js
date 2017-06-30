// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * load-map
 *
 * Load AMap instance by jsonp.
 *
 * @require {string} AMAP_URL 
 * @require {string} AMAP_KEY
 */

import getRoot from 'lib/get-root'
import registerJsonp from 'lib/register-global-jsonp'

function loadMap(key: string, plugins: Array<string>): Promise<*> {
  const root = getRoot()

  if (root.AMap) {
    return Promise.resolve(root.AMap)
  }

  function jsonp(resolve, reject, global, callback): Function {
    return function(): void {
      global.AMap ? resolve(global.AMap) : reject()
      console.log(callback)
      callback()
    }
  }

  function makeAMapUrl(key: string, plugins: Array<string>): Function {
    return function(callback): string {
      if (!process.env.AMAP_URL) {
        throw new Error(`Not Found AMAP_URL defined.`)
      }

      return `\
${process.env.AMAP_URL}&\
${key ? `key=${key}&` : ''}\
${plugins.length !== 0 ? `plugin=${plugins.join(',')}&` : ''}\
callback=${callback}`
    }
  }

  return registerJsonp(jsonp, makeAMapUrl(key || null, plugins || []))
}

export default loadMap
