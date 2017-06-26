// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

const AMAP_URL = 'http://webapi.amap.com/maps?v=1.3'

function loadScript(key, plugins, callback) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.defer = true
  script.src = `\
http://webapi.amap.com/maps?v=1.3&\
${key ? `key=${key}&` : ''}\
${plugins.length !== 0 ? `plugin=${plugins.join(',')}&` : ''}\
callback=${callback}`
  return script
}

function createKey(len) {
  return Math.random().toString(36).substr(2, len)
}

function registerCallback(global, resolve) {
  const key = createKey(10)
  global[key] = unregister(global, key, resolve)
  return key
}

function unregister(global, jsonp, resolve) {
  return function() {
    const instance = global.AMap
    delete global[jsonp]
    //delete global['AMap']
    resolve(instance)
  }
}

export default function loadMap(key = null, plugins = []) {
  return new Promise(function(resolve, reject) {
    if (window.AMap) {
      resolve(AMap)
    } else {
      const script = loadScript(key, plugins, registerCallback(window, resolve))
      script.onerror = reject
      document.head.appendChild(script)
    }
  })
}
