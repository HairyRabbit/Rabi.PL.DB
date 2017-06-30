// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * register-global-jsonp
 *
 * Register a jsonp on global object with a promise.
 *
 * @require {Object} window
 */

import getRoot from 'lib/get-root'
import makeJsonpScript from 'lib/make-jsonp-script'
import randomString from 'lib/random-string'

function registerGlobalJsonp(jsonp: Function, callback: Function): Promise<*> {
  const global: Object = getRoot()
  const key: string = `jsonp_${randomString(12)}`
  const script: HTMLElement = makeJsonpScript(callback(key))

  function clearGlobalJsonpCallback(): void {
    setTimeout(function() {
      delete global[key]
    })
  }

  return new Promise(function(resolve: Function, reject: Function): void {
    global[key] = jsonp(resolve, reject, global, clearGlobalJsonpCallback)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default registerGlobalJsonp
