// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * dll-options
 *
 * Dll commons options.
 */

import path from 'path'
import dllFileOrDir from '../dll-file-or-dir'
import { DllPlugin, DllReferencePlugin } from 'webpack'

type DllEntry = {
  [string]: Array<string>
}

type DllOutput = {
  path: string,
  filename: '[name].js',
  library: '[name]'
}

export type DllOptions = {
  entry: DllEntry,
  output: DllOutput,
  plugins: Array<DllPlugin>
}

export default function dllOptions(
  distPath: string,
  entry: DllEntry
): DllOptions {
  const dllfod = dllFileOrDir(distPath)

  return {
    entry: entry,
    output: {
      path: dllfod(),
      filename: '[name].js',
      library: '[name]'
    },
    plugins: [
      new DllPlugin({
        path: dllfod('[name]-manifest.json'),
        name: '[name]'
      })
    ]
  }
}

/**
 * dllScriptPath
 *
 * Runtime dll file path.
 *
 * @sig string -> string
 */
export function dllScriptPath(name: string): string {
  return `dll/${name}.js`
}

/**
 * dllRefPlugin
 *
 * Find dll libs.
 *
 * @sig (string, string) -> DllReferencePlugin 
 */
export function dllRefPlugin(
  distPath: string,
  name: string
): DllReferencePlugin {
  const dllfod = dllFileOrDir(distPath)

  return new DllReferencePlugin({
    context: '.',
    manifest: dllfod(`${name}-manifest.json`)
  })
}
