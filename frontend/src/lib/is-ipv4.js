// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * is-ipv4
 *
 * Test if value is a ipv4 address.
 */

function ipv4(value: string): boolean {
  const regex: RegExp = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/
  return regex.test(value)
}

export default ipv4
