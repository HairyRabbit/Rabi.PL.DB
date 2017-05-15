// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * make
 * 
 * Build
 */

import webpack from 'webpack'
import makeDll from './dll/dll'
import makeApp from './app-dev'
import type { Dll } from './dll/dll'

type Task = 'dll' | 'app'
type Env = 'development' | 'production'

type Options = {
  task: Task,
  env: Env,
  dll: Dll
}

export default function make(options: Options): any {
  const { task, env, dll } = options

  switch (task) {
    case 'dll':
      return makeDll(dll)

    case 'app':
      return makeApp(env)

    default:
      throw new Error(`Unknow task ${task}`)
  }
}
