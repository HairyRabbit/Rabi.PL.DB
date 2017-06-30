// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * random-string
 *
 * Generate a random string.
 */

function randomString(len: number): string {
  return Math.random().toString(36).substr(2, len)
}

export default randomString
