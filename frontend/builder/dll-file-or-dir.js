// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-options
 *
 * Dll common options.
 */

import path from 'path'

type BaseDirname = string
type Filename = string

/**
 * Return dll file or directory
 * 
 * @sig path.resolve -> BaseDirname -> filename? -> string
 */

const dllFileOrDir = (resolve: path.resolve) => (baseDir: BaseDirname) => (
  filename?: Filename
): string => {
  const dllPath: string = resolve(baseDir, 'dll')
  if (!filename) return dllPath
  return resolve(dllPath, filename)
}

export default dllFileOrDir(path.resolve)
