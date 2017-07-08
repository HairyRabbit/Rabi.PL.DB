// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * pretty-print-table
 *
 * Print a table on console.
 */

import padEnd from 'lodash/padEnd'

function decode(str: string): Array<Array<string>> {
  return str
    .split('\n')
    .filter(Boolean)
    .map(n => n.split('|').filter(Boolean).map(m => m.trim()))
}

function encode(cols: Array<number>, str: Array<Array<string>>): string {
  return str
    .map(n => {
      return (
        '| ' +
        n
          .map((m, idx) => {
            return padEnd(m, cols[idx], ' ')
          })
          .join(' | ') +
        ' |'
      )
    })
    .join('\n')
}

function colLen(str: Array<Array<string>>): Array<number> {
  let cols: Array<number> = []
  for (var i = 0; i < str.length; i++) {
    for (var j = 0; j < str[i].length; j++) {
      cols[j] = cols[j] || 0
      cols[j] = Math.max(cols[j], str[i][j].length)
    }
  }
  return cols
}

function prettyPrintTable(str: string): string {
  const decodeStr: Array<Array<string>> = decode(str)
  const cols: Array<number> = colLen(decodeStr)
  return encode(cols, decodeStr)
}

export default prettyPrintTable
