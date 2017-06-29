// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * map-filepath-to-modulefile
 *
 * Used by webpack resolver.
 */

import glob from 'glob'
import path from 'path'
import { promisify } from 'util'

export default function mapFilePathToModuleFile(
  prefix: string,
  suffix: string
): Array<string> {
  const sourcePath: string = path.resolve(__dirname, 'node_modules', prefix)

  function mapper(filepath: string): string {
    const filename: string = path
      .relative(sourcePath, filepath)
      .replace(/\\/g, '/')
    return prefix + '/' + filename
  }

  return glob.sync(path.resolve(sourcePath, suffix)).map(mapper)
}
