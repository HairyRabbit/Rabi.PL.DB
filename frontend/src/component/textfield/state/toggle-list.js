// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import stubTrue from 'lodash/stubtrue'
import identity from 'lodash/identity'
import { mapToDisplay, matched } from './change-value'
import type {
  Model,
  Type,
  AutoComplete,
  Display,
  Direction,
  ToggleListAction
} from '../types'

function setDisplay<T>(
  model: Model<T>,
  visibility: boolean,
  filter: any => boolean
): Model<T> {
  // TODO Animation
  const ac: ?AutoComplete<T> = model.autocomplete
  const list: Array<T> = ac.list
  return {
    ...model,
    autocomplete: {
      ...ac,
      display: visibility ? list.filter(filter).sort().map(mapToDisplay) : []
    }
  }
}

function toggleList<T>(model: Model<T>, action: ToggleListAction<T>): Model<T> {
  const ac: ?AutoComplete<T> = model.autocomplete

  // basic set value
  if (!ac) {
    return model
  }

  // empty ac list
  const list: Array<T> = ac.list

  if (list.length === 0) {
    return model
  }

  const decode: T => string = action.payload.decode || identity
  const visibility: boolean = action.payload.visibility
  const value: string = model.value
  return setDisplay(
    model,
    visibility,
    value === '' ? stubTrue : matched(decode, value)
  )
}

export default toggleList
