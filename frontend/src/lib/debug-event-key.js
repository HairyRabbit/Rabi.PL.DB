// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * debug-event-key
 *
 * Debug key code and help key.
 */

import print from './pretty-print-table'

function DebugKey(evt: any): string {
  return print(`\
| key | code | ctrl | alt | meta | shift |
| ${evt.key} | ${evt.which} | ${evt.ctrlKey} | ${evt.altKey} | ${evt.metaKey} | ${evt.shiftKey} |
`)
}

export default DebugKey
