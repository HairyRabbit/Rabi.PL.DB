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
import { promisify } from 'util'

type Name = string
type Content = string
type ConfigTuple = [Name, Content]

function readFile(path) {
  const readFilePromise = promisify(fs.readFile)
  return readFilePromise(path, 'utf8')
}

export default function foldConfigs(configs: Array<string>): Object {
  function mapper(config: string): ConfigTuple {
    const basename: string = path.basename(config, '.json')
    const content: string = fs.readFileSync(`./config/${basename}.json`)
    return [basename, JSON.parse(content)]
  }

  function folder(acc: Object, curr: ConfigTuple): Object {
    acc[curr[0]] = curr[1]
    return acc
  }

  return configs.map(mapper).reduce(folder, {})
}
