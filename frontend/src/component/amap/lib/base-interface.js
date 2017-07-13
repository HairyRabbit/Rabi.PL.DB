// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

export type EventMap = {
  [string]: AMap.EventListener
}

export type EventAliasOptions = {
  [string]: string
}

export type MapComponentContext = {
  map: AMap.Map,
  AMap: typeof AMap
}

export interface MapComponent {
  events: EventMap,
  load(): void | Promise<*>
}

export type LocationCenter = [number, number] | { position: AMap.LngLat }
