// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * app
 *
 * Build souce code.
 */

import buildDev from './app-dev'
import buildProd from './app-prod'
import type { WebpackOptions } from './../webpack-options'

export type Env = 'development' | 'production'

export default function makeApp(env: Env) {
  const appDev = buildDev()
  const appProd = buildProd()

  switch (env) {
    case 'development':
      return appDev
    case 'production':
      return appProd
    default:
      throw new Error(`Unsupports env ${env}`)
  }
}
