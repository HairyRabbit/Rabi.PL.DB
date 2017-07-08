// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

export default function bindNativeEventHandle(
  handle: Function,
  callback: Function
): Function {
  return function(evt: Event): void {
    if (typeof callback === 'function') {
      callback(evt)
    }

    if (typeof handle === 'function') {
      handle(evt)
    }
  }
}
