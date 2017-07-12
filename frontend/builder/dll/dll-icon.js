// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-icon
 *
 * Bundle icons with `feather`
 */

import mapToFilename from '../map-filepath-to-modulefile'
import dllOptions from './dll-options'
import type { DllOptions } from './dll-options'

export default function makeIconDll(distPath: string): DllOptions {
  return dllOptions(distPath, {
    icon: mapToFilename('feather-icons/dist/icons', '**/*.svg')
  })
}
