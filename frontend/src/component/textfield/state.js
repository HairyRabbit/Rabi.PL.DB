// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import eq from 'lodash/eq'
import identity from 'lodash/identity'
import ipv4 from 'lib/is-ipv4'
import changeValue from './state/change-value'
import turnActive from './state/turn-active'
import toggleList from './state/toggle-list'
import { ChangeValue, TurnActive, ToggleList } from './types'
import type {
  Model,
  Action,
  Type,
  AutoComplete,
  Display,
  Direction,
  ChangeValueAction,
  TurnActiveAction,
  ToggleListAction
} from './types'

/// INIT

export const initAutoComplete: AutoComplete<*> = {
  list: [],
  display: []
}

export const initModel: Model<*> = {
  value: ''
}

/// UPDATE

export function update<T>(model: Model<T>, action: Action<T>): Model<T> {
  switch (action.type) {
    case ChangeValue:
      return changeValue(model, action)
    case TurnActive:
      return turnActive(model, action)
    case ToggleList:
      return toggleList(model, action)
    default:
      return model
  }
}

/// ACTION

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

export function toggle(
  decode: T => string,
  visibility: boolean
): ToggleListAction {
  return {
    type: ToggleList,
    payload: {
      decode,
      visibility
    }
  }
}

/// HELPER

function encodeIpv4(str: string): string {
  return decodeIpv4(str).join(' . ')
}

function decodeIpv4(str: string): Array<string> {
  return str.split('.').map(n => n.trim())
}
