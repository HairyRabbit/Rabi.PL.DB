// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-hmr
 *
 * Make `Hot Module Replace` dll with webpack-dev-server
 * and react-hot-loader@next.
 */

import dllOptions from './dll-options'
import type { DllOptions } from './dll-options'

export default function makeHMRDll(distPath: string): DllOptions {
  const hmrLibs = [
    'react-hot-loader/patch',
    'react-hot-loader',
    'webpack-dev-server/client'
  ]

  return dllOptions(distPath, { hmr: hmrLibs })
}
