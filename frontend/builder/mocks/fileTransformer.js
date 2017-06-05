// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import path from 'path'

export default {
  process(
    src: string,
    filename: string,
    config: Object,
    options: Object
  ): string {
    return 'export default ' + JSON.stringify(path.basename(filename))
  }
}
