// -*- mode: js -*-
// -*- coding: utf-8 -*-

// require worker

export function request(params): Object => Promise<Object> {
  work.postMessage(params)
}
