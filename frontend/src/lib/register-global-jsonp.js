// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * register-global-jsonp
 *
 * Register a jsonp on global object with a promise.
 *
 * @env {string} JSONP_PREFIX
 * @env {string} JSONP_SIZE
 */

import getRoot from 'lib/get-root'
import makeJsonpScript from 'lib/make-jsonp-script'
import randomString from 'lib/random-string'

type Options = {
  prefix?: string,
  size?: number
}

const defaultOptions: Options = {
  prefix: 'jsonp',
  size: 12
}

function registerGlobalJsonp(
  jsonp: Function,
  feedback: Function,
  options?: Options
): Promise<*> {
  const global: Object = getRoot()
  const opt: Options = { ...options }
  const prefix: $PropertyType<Options, 'prefix'> =
    opt.prefix || process.env.JSONP_PREFIX || defaultOptions.prefix
  const size: $PropertyType<Options, 'size'> =
    opt.size || process.env.JSONP_SIZE || defaultOptions.size
  const key: string = `${prefix}_${randomString(size)}`
  const script: HTMLElement = makeJsonpScript(feedback(key))

  function removeScriptTag(): void {
    // FIXME Care about `document`
    document.head.removeChild(script)
  }

  function destroyJsonpCallback(callback: Function): void {
    setTimeout(function() {
      global[key] = null
      delete global[key]

      // NOTE Used remove script tag
      callback && callback(removeScriptTag)
    })
  }

  return new Promise(function(resolve: Function, reject: Function): void {
    global[key] = jsonp(resolve, reject, global, destroyJsonpCallback)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default registerGlobalJsonp
