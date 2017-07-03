// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * bind-events
 *
 * Binding AMap.event.
 */

import normalizeEventName from './normalize-event-name'

function folder<T, P, O>(
  AMap: AMap,
  target: T,
  props: P,
  options: O
): Function {
  return function(acc: Object, curr: string): { [string]: AMap$EventListener } {
    const name: string = options[curr] || normalizeEventName(curr)
    const event: AMap$EventListener = AMap.event.addListener(
      target,
      name,
      props[curr]
    )
    acc[curr] = event
    return acc
  }
}

function bindEvents(
  AMap: AMap,
  target: any,
  props: { [string]: any },
  options?: { [string]: string }
): { [string]: AMap$EventListener } {
  return Object.keys(props)
    .filter(x => /^on/.test(x))
    .reduce(folder(AMap, target, props, options || {}), {})
}

export default bindEvents
