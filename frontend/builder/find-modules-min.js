// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * find-modules-min
 *
 * Find modules mini file.
 */

import path from 'path'
import glob from './glob-promise'

export type Libname = string
export type Filepath = string
export type MiniFilepathTuple = [Libname, Filepath]

function miniFilePath(nodeModulesPath, fileAbsolutePath) {
  return path
    .relative(nodeModulesPath, fileAbsolutePath)
    .split(path.sep)
    .join('/')
}

export default function findMiniFile(
  name: Libname
): Promise<?MiniFilepathTuple> {
  const nodeModulesPath = path.resolve(__dirname, 'node_modules')
  return glob(
    path.resolve(nodeModulesPath, `${name}/**/*.min.js`)
  ).then((files: Array<Filepath>): ?MiniFilepathTuple => {
    if (files.length === 0) {
      console.warn(`WARNING find UMD version of ${name} failed!`)
      return null
    }

    const fileAbsolutePath = files.sort().reverse()[0]

    return [name, miniFilePath(nodeModulesPath, fileAbsolutePath)]
  })
}
