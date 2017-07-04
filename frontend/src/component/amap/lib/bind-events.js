// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * bind-events
 *
 * Binding AMap.event.
 */

import normalizeEventName from './normalize-event-name'
import type { EventMap } from './base-interface'

function folder<A, T, P, O>(
  AMap: A,
  target: T,
  props: P,
  options: O
): Function {
  return function(acc: EventMap, curr: string): EventMap {
    const name: string = options[curr] || normalizeEventName(curr)
    const event: AMap.EventListener = AMap.event.addListener(
      target,
      name,
      props[curr]
    )
    acc[curr] = event
    return acc
  }
}

function bindEvents<T, P>(
  AMap: typeof AMap,
  target: T,
  props: P,
  options?: { [string]: string }
): EventMap {
  return Object.keys(props)
    .filter(x => /^on/.test(x))
    .reduce(folder(AMap, target, props, options || {}), {})
}

export default bindEvents
