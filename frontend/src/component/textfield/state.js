// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * textfield/state
 */

import { Change } from './types'
import type { Model, Action, Type, OnChangeAction } from './types'
import ipv4 from 'lib/is-ipv4'

/// Update

export const initModel: Model = {
  value: ''
}

export function update(model: Model = initModel, action: ?Action): Model {
  if (!action) return model

  switch (action.type) {
    case Change: {
      if (action.payload === null) return model
      return Object.assign({}, model, {
        value: action.payload
      })
    }

    default:
      return model
  }
}

/// Action

export function onChange(value: string, type: Type): OnChangeAction {
  switch (type) {
    case 'ipv4': {
      if (!ipv4(value)) {
        return {
          type: Change,
          payload: null
        }
      }
      return {
        type: Change,
        payload: value
      }
    }

    default:
      return {
        type: Change,
        payload: value
      }
  }
}
