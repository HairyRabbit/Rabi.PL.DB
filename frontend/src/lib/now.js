// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

function now() {
  return performance ? performance.now() : Date.now ? Date.now() : +new Date()
}
