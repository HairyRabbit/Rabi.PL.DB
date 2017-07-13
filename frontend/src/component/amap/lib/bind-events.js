// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * bind-events
 *
 * Binding AMap.event.
 */

import normalizeEventName from './normalize-event-name'
import type { EventMap, EventAliasOptions } from './base-interface'

type EventTarget = AMap.Map | AMap.Marker | AMap.InfoWindow

function folder(
  AMap: typeof AMap,
  target: EventTarget,
  props: *,
  options: EventAliasOptions
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

function bindEvents(
  AMap: typeof AMap,
  target: EventTarget,
  props: *,
  options?: EventAliasOptions
): EventMap {
  return Object.keys(props)
    .filter(x => /^on/.test(x))
    .reduce(folder(AMap, target, props, options || {}), {})
}

export function removeEvents(AMap: typeof AMap, events: EventMap): {} {
  function removeEventHandle(key: string): void {
    AMap.event.removeListener(events[key])
    delete events[key]
  }

  Object.keys(events).forEach(removeEventHandle)

  return events
}

export default bindEvents
