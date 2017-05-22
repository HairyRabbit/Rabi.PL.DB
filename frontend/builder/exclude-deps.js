// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * exclude-deps
 *
 * Exclude deps of 'package.json', and use 'unpkg.com' CDN instead.
 *
 * TODO 'cdnjs.com' supports.
 */

import path from 'path'
import deps from './pkg-deps'
import findMiniFile from './find-modules-min'
import type { MiniFilepathTuple, Libname, Filepath } from './find-modules-min'

type LibUmdName = string
type LibTuple = [Libname, Filepath, LibUmdName]

export default function excludeDeps(): Promise<Array<LibTuple>> {
  return Promise.all(
    deps.map(findMiniFile)
  ).then((results: Array<?MiniFilepathTuple>): Array<LibTuple> => {
    function replacer(regex: RegExp): Function {
      return (str: string): string => {
        return str.replace(regex, function(f, a) {
          return a.toUpperCase()
        })
      }
    }

    function mapper(filepathTuple: MiniFilepathTuple): LibTuple {
      const [libname: Libname] = filepathTuple
      const libUmdName: LibUmdName = replacer(/^(\w)/)(
        replacer(/-(\w)/g)(libname)
      )
      return [...filepathTuple, libUmdName]
    }

    return results.filter(Boolean).map(mapper)
  })
}
