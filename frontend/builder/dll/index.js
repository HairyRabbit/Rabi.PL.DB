// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll
 *
 * Build dll libs
 */

import path from 'path'
import type { DllOptions, Dll } from './dll-options'
import vendorDll from './dll-vendor'
import hmrDll from './dll-hmr'

type DllTask = DllOptions | Array<DllOptions>

export default function makeDll(task?: Dll): DllTask {
  const distPath: string = path.resolve(__dirname, 'dist')
  const vendor: DllOptions = vendorDll(distPath)
  const hmr: DllOptions = hmrDll(distPath)

  switch (task) {
    case 'vendor':
      return vendor
    case 'hmr':
      return hmr
    default:
      return [vendor, hmr]
  }
}
