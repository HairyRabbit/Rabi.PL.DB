// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-vendor
 *
 * Package all dependencies to dll.
 */

import dllOptions from './dll-options'
import type { DllOptions } from './dll-options'
import deps from '../pkg-deps'

export default function makeVendorDll(distPath: string): DllOptions {
  return dllOptions(distPath, { vendor: deps })
}
