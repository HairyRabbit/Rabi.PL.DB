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
import iconDll from './dll-icon'

type DllTask = DllOptions | Array<DllOptions>

export default function makeDll(task?: Dll): DllTask {
  const distPath: string = path.resolve(__dirname, 'dist')
  const vendor: DllOptions = vendorDll(distPath)
  const hmr: DllOptions = hmrDll(distPath)
  const icon: DllOptions = iconDll(distPath)

  switch (task) {
    case 'vendor':
      return vendor
    case 'hmr':
      return hmr
    case 'icon':
      return icon
    default:
      return [vendor, hmr, icon]
  }
}
