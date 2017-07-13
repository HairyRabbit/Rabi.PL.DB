// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * load-map
 *
 * Load AMap instance by jsonp.
 *
 * TODO support amap plugins preload via AMAP_PLUGINS.
 *
 * @env {string} AMAP_URL
 * @env {string} AMAP_KEY
 * @env {string} AMAP_VERSION
 */

import { defaults } from 'lodash'
import getRoot from 'lib/get-root'
import registerJsonp from 'lib/register-global-jsonp'

type Options = {
  url?: string,
  version?: string,
  key?: string,
  plugins?: Array<string>
}

const defaultOptions: Options = {
  key: '',
  url: 'http://webapi.amap.com/maps',
  version: '1.3',
  plugins: []
}

const envOptions = {
  key: process.env.AMAP_KEY,
  url: process.env.AMAP_URL,
  version: process.env.AMAP_VERSION
}

function jsonp(
  resolve: Function,
  reject: Function,
  global: Object,
  callback: Function
): Function {
  return function(): void {
    global.AMap ? resolve(global.AMap) : reject()
    callback()
  }
}

function makeRequestUrl(options: Options): Function {
  const opts: Options = defaults({}, options, envOptions, defaultOptions)
  const { url, version, key, plugins } = opts

  const error_message: string = 'Must provide AMap JSSDK %s'

  if (!url || !version) {
    throw new Error(`Must provide AMap load url and version`)
  }

  // invariant(url, error_message, 'url')
  // invariant(version, error_message, 'version')
  //invariant(key, error_message, 'key')

  return function(callback: string): string {
    const href = `\
${url}?\
v=${version}&\
${key ? `key=${key}&` : ''}\
${plugins && plugins.length !== 0 ? `plugin=${plugins.join(',')}&` : ''}\
callback=${callback}`

    if (process.env.NODE_ENV === 'development') {
      console.log(`[AMap] Load AMap scripts ${href}`)
    }

    return href
  }
}

function loadMap(options?: Options): Promise<typeof AMap> {
  const root: Object = getRoot()

  if (root.AMap) {
    return Promise.resolve(root.AMap)
  }

  return registerJsonp(jsonp, makeRequestUrl(options || {}))
}

export default loadMap
