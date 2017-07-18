// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

function mapCssTimeUnitToMillisecond(second: string): number {
  const endsWithSecond: boolean = second.endsWith('s')
  if (endsWithSecond) {
    return parseFloat(second.slice(1)) * 1000
  }

  return parseFloat(second.slice(2))
}

export default mapCssTimeUnitToMillisecond
