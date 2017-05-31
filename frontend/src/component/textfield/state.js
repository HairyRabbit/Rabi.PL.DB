// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import eq from 'lodash/eq'
import identity from 'lodash/identity'
import ipv4 from 'lib/is-ipv4'
import changeValue from './state/change-value'
import turnActive from './state/turn-active'
import { ChangeValue, TurnActive } from './types'
import type {
  Model,
  Action,
  Type,
  AutoComplete,
  Display,
  Direction,
  ChangeValueAction,
  TurnActiveAction
} from './types'

/// Init

export const initAutoComplete: AutoComplete<*> = {
  list: [],
  display: []
}

export const initModel: Model<*> = {
  value: ''
}

/// Update

export function update<T>(model: Model<T>, action: Action<T>): Model<T> {
  switch (action.type) {
    case ChangeValue:
      return changeValue(model, action)
    case TurnActive:
      return turnActive(model, action)
    default:
      return model
  }
}

/// Action

export function change<T>(
  value: string,
  type: Type,
  decode: T => string
): ChangeValueAction<T> {
  switch (type) {
    case 'ipv4': {
      // Fixed backspace keypress can't delete chats.
      return {
        type: ChangeValue,
        payload: {
          value: value.slice(-1) === '.' ? value : encodeIpv4(value),
          decode
        }
      }
    }

    default:
      return {
        type: ChangeValue,
        payload: {
          value,
          decode
        }
      }
  }
}

export function turn(dir: number): TurnActiveAction {
  return {
    type: TurnActive,
    payload: {
      direction: dir
    }
  }
}

/// Helper

function encodeIpv4(str: string): string {
  return decodeIpv4(str).join(' . ')
}

function decodeIpv4(str: string): Array<string> {
  return str.split('.').map(n => n.trim())
}
