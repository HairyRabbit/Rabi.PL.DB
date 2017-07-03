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

import invariant from 'invariant'
import getRoot from 'lib/get-root'
import registerJsonp from 'lib/register-global-jsonp'

type Options = {
  url?: string,
  version?: string,
  key?: string,
  plugins?: Array<string>
}

const defaultOptions: Options = {
  plugins: []
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
  const url: ?$PropertyType<Options, 'url'> =
    options.url || process.env.AMAP_URL
  const version: ?$PropertyType<Options, 'version'> =
    options.version || process.env.AMAP_VERSION
  const key: ?$PropertyType<Options, 'key'> =
    options.key || process.env.AMAP_KEY
  const plugins: $PropertyType<Options, 'plugins'> =
    options.plugins || defaultOptions.plugins
  const error_message: string = 'Must provide AMap JSSDK %s'

  invariant(url, error_message, 'url')
  invariant(version, error_message, 'version')
  invariant(key, error_message, 'key')

  return function(callback: string): string {
    // TODO ${key ? `key=${key}&` : ''}\
    return `\
${url}?\
v=${version}&\
key=${key}&\
${plugins && plugins.length !== 0 ? `plugin=${plugins.join(',')}&` : ''}\
callback=${callback}`
  }
}

function loadMap(options?: Options): Promise<*> {
  const root: Object = getRoot()

  if (root.AMap) {
    return Promise.resolve(root.AMap)
  }

  return registerJsonp(jsonp, makeRequestUrl(options || {}))
}

export default loadMap
