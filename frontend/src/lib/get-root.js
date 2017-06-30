// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * get-root
 *
 * Get head object.
 */

function getRoot(): Object {
  let root

  if (typeof self !== 'undefined') {
    root = self
  } else if (typeof window !== 'undefined') {
    root = window
  } else if (typeof global !== 'undefined') {
    root = global
  } else if (typeof module !== 'undefined') {
    root = module
  } else {
    root = Function('return this')()
  }

  return root
}

export default getRoot
