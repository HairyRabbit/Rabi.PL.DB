// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * textfield/state
 */

import { Change } from './types'
import type { Model, Action, OnChangeAction } from './types'

/// Update

export const initModel: Model = {
  value: ''
}

export function update(model: Model = initModel, action: ?Action): Model {
  if (!action) return model

  switch (action.type) {
    case Change:
      return Object.assign({}, model, {
        value: action.payload
      })

    case ClearInput:
      return Object.assign({}, model, {
        value: ''
      })

    default:
      return model
  }
}

/// Action

export function onChange(value: string): OnChangeAction {
  return {
    type: Change,
    payload: value
  }
}

export function clearInput(): ClearInputAction {
  return {
    type: ClearInput
  }
}
