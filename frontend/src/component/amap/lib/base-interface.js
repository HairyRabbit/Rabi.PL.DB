// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

export type EventMap = {
  [string]: AMap.EventListener
}

export type MapComponentContext = {
  map: AMap.Map,
  AMap: typeof AMap
}

export interface MapComponent {
  map: AMap.Map,
  AMap: typeof AMap,
  events: EventMap,
  load(): void | Promise<*>
}
