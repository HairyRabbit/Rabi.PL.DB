// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import type {
  Model,
  Type,
  AutoComplete,
  Display,
  Direction,
  ChangeValueAction
} from '../types'

function mapActive<T>(activep: boolean): Function {
  return function(item: Display<T>): Display<T> {
    return {
      ...item,
      active: activep
    }
  }
}

function turnIndex(
  curr: number,
  len: number,
  dir: Direction,
  init: number
): number {
  switch (dir) {
    case 1: {
      if (curr === -1) {
        return 0
      } else {
        return curr + 1 > len - 1 ? 0 : curr + 1
      }
    }
    case -1: {
      if (curr === -1) {
        return len - 1
      } else {
        return curr - 1 < 0 ? len - 1 : curr - 1
      }
    }
    default: {
      return init
    }
  }
}

function updateIndex<T>(arr: Array<T>, idx: number, caller: T => T): Array<T> {
  return [...arr.slice(0, idx), caller(arr[idx]), ...arr.slice(idx + 1)]
}

function turnActive<T>(model: Model<T>, action: TurnActiveAction): Model<T> {
  const ac: ?AutoComplete<T> = model.autocomplete

  // not enable ac
  if (!ac) {
    return model
  }

  const list: Array<T> = ac.list

  // empty list
  if (list.length === 0) {
    return model
  }

  const display: Array<Display<T>> = ac.display
  const len: number = display.length

  // empty display list
  if (len === 0) {
    return model
  }

  // only one item
  if (len === 1) {
    return {
      ...model,
      autocomplete: {
        ...ac,
        display: display.map(mapActive(true))
      }
    }
  }

  // TODO pick turn idx to libs
  const idx: number = display.findIndex(item => Boolean(item.active))
  const dir: Direction = action.payload.direction
  const next: number = turnIndex(idx, len, dir, 0)
  const di: Array<Display<T>> = display.map(mapActive(false))

  return {
    ...model,
    autocomplete: {
      ...ac,
      display: updateIndex(di, next, mapActive(true))
    }
  }
}

export default turnActive
