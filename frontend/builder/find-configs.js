// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * find-config
 *
 * find all config file paths.
 */

import path from 'path'
import glob from './glob-promise'

export default function findConfigs(
  configPath: string
): Promise<Array<string>> {
  const configs: string = path.resolve(configPath, '*.json')

  return glob(configs)
}
