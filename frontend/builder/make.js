// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * make
 * 
 * Build
 */

import makeDll from './dll'
import makeApp from './app'
import type { Dll } from './dll/dll-options'
import type { Env } from './app'

type Task = 'dll' | 'app'

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
