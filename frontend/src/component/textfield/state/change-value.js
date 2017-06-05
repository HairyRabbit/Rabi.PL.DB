// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import stubTrue from 'lodash/stubtrue'
import identity from 'lodash/identity'
import type {
  Model,
  Type,
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
    const regex: RegExp = new RegExp(`^${value}`)
    return Boolean(decode(item).match(regex))
  }
}

function changeValue<T>(
  model: Model<T>,
  action: ChangeValueAction<T>
): Model<T> {
  const value: string = action.payload.value

  // value no changed
  if (value === model.value) {
    return model
  }

  const ac: ?AutoComplete<T> = model.autocomplete

  // basic set value
  if (!ac) {
    return { ...model, value: value }
  }

  // empty ac list
  const list: Array<T> = ac.list

  if (list.length === 0) {
    return { ...model, value: value }
  }

  // matched value
  const decode: T => string = action.payload.decode || identity

  return {
    ...model,
    value: value,
    autocomplete: {
      ...ac,
      display: list
        .filter(value === '' ? stubTrue : matched(decode, value))
        .sort()
        .map(mapToDisplay)
    }
  }
}

export default changeValue
