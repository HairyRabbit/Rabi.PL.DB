// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import stubTrue from 'lodash/stubtrue'
import identity from 'lodash/identity'
import type {
  Model,
  Type,
  PasswordOption,
  AutoComplete,
  Display,
  Direction,
  ChangeValueAction
} from '../types'

export function mapToDisplay<T>(item: T, idx: number): Display<T> {
  return {
    value: item,
    active: idx === 0
  }
}

export function matched<T>(decode: T => string, value: string): Function {
  return function(item: T): boolean {
    const regex: RegExp = new RegExp(
      `^${value.replace(/(\[|\]|\(|\))/g, '\\$1')}`
    )
    return Boolean(item.match(regex))
  }
}

function changeValue<T>(
  model: Model<T>,
  action: ChangeValueAction<T>
): Model<T> {
  const value: string = action.payload.value
  var model: Model<T> = model

  // value no changed
  if (value === null || value === model.value) {
    return model
  }

  // password options
  const passopt: ?PasswordOption = model.passwordOption
  if (passopt) {
    console.log(action.payload.strength, action.payload.error)
    model = {
      ...model,
      passwordOption: {
        ...passopt,
        strength: action.payload.strength,
        error: action.payload.error
      }
    }
  }

  // auto-complete
  const ac: ?AutoComplete<T> = model.autocomplete
  if (ac) {
    // empty ac list
    const list: Array<T> = ac.list

    if (list.length !== 0) {
      // matched value
      const decode: T => string = action.payload.decode || identity

      model = {
        ...model,
        autocomplete: {
          ...ac,
          display: list
            .filter(value === '' ? stubTrue : matched(decode, value))
            .sort()
            .map(mapToDisplay)
        }
      }
    }
  }

  return { ...model, value: value }
}

export default changeValue
