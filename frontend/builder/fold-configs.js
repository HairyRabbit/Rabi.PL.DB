// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * fold-configs
 *
 * fold config files setting to config object.
 */

import path from 'path'

type Name = string
type Content = string
type ConfigTuple = [Name, Content]

export default function foldConfigs(configs: Array<string>): Object {
  function mapper(config: string): ConfigTuple {
    const basename: string = path.basename(config, '.json')
    const content: string = require(`json-loader!../config/${basename}.json`)
    return [basename, content]
  }

  function folder(acc: Object, curr: ConfigTuple): Object {
    acc[curr[0]] = curr[1]
    return acc
  }

  return configs.map(mapper).reduce(folder, {})
}
