// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

function combineClassnames(...classnames: Array<string>): string {
  return classnames.join(' ')
}

export default combineClassnames
