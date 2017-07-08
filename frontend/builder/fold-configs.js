// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * fold-configs
 *
 * fold config files setting to config object.
 */

import fs from 'fs'
import path from 'path'

export default function foldConfigs(configs: Array<string>): Object {
  function mapper(config: string): [string, string] {
    const basename: string = path.basename(config, '.json')
    const content: string = fs
      .readFileSync(`./config/${basename}.json`)
      .toString()
    return [basename, JSON.parse(content)]
  }

  function folder(acc: Object, curr: [string, string]): Object {
    acc[curr[0]] = curr[1]
    return acc
  }

  return configs.map(mapper).reduce(folder, {})
}
