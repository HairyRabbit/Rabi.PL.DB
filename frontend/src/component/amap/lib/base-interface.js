// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

export interface MapComponent {
  map: AMap$Map,
  AMap: AMap,
  events: {
    [string]: AMap$EventListener
  },
  load(): void | Promise<*>
}
