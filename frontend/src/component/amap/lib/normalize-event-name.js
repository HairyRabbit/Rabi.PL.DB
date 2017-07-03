// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

function normalizeEventName(key: string): string {
  return key.slice(2).toLowerCase()
}

export default normalizeEventName
