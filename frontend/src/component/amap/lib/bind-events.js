// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * bind-events
 *
 * Binding AMap.event.
 */

import normalizeEventName from './normalize-event-name'

function folder(AMap, target, props, options) {
  return function(acc, curr) {
    const name: string = options[curr] || normalizeEventName(curr)
    const event: any = AMap.event.addListener(target, name, props[curr])
    acc[curr] = event
    return acc
  }
}

function bindEvents(AMap, target, props, options) {
  return Object.keys(props)
    .filter(x => /^on/.test(x))
    .reduce(folder(AMap, target, props, options || {}), {})
}

export default bindEvents
