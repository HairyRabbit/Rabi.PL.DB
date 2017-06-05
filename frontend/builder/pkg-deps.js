// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * pkg-deps
 *
 * Pick dependencies of package.json 
 */

import pkg from '../package.json'

type Dependencies = {
  [string]: string
}

/**
 * vendos
 *
 * Exclude css libs like 'normalize.css'
 *
 * @sig Dependencies -> Array<string>
 */
function vendors(deps: Dependencies): Array<string> {
  // TODO blacklist supports
  //return Object.keys(deps).filter(x => !/\.css$/.test(x))
  return Object.keys(deps)
}

export default vendors(pkg.dependencies)
