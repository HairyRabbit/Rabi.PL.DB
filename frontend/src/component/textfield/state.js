// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import eq from 'lodash/eq'
import identity from 'lodash/identity'
import uniq from 'lodash/uniq'
import ipv4 from 'lib/is-ipv4'
import passStrength from 'lib/mapto-password-strength'
import passError, {
  initPasswordError,
  hasError
} from 'lib/mapto-password-error'
import changeValue from './state/change-value'
import turnActive from './state/turn-active'
import toggleList from './state/toggle-list'
import togglePassVisibility from './state/toggle-password-visibility'
import {
  ChangeValue,
  TurnActive,
  ToggleList,
  TogglePasswordVisibility
} from './types'
import type {
  Model,
  Action,
  Type,
  AutoComplete,
  PasswordOption,
  PasswordError,
  PasswordStrength,
  Display,
  Direction,
  ChangeValueAction,
  TurnActiveAction,
  ToggleListAction,
  TogglePasswordVisibilityAction
} from './types'

/// INIT

export const initAutoComplete: AutoComplete<*> = {
  list: [],
  display: []
}

export const initPasswordOption: PasswordOption = {
  visibility: false,
  strength: null,
  error: initPasswordError
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
    case TogglePasswordVisibility:
      return togglePassVisibility(model, action)
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
  // return function(dispatch) {
  //   return dispatch((function() {
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

    case 'password': {
      const errors = passError(value)
      return {
        type: ChangeValue,
        payload: {
          value,
          decode,
          strength: !hasError(errors) ? passStrength(value) : null,
          error: errors
        }
      }
    }

    case 'number': {
      if (value === '-') {
        return {
          type: ChangeValue,
          payload: {
            value,
            decode
          }
        }
      }

      if (isNaN(Number(value))) {
        return {
          type: ChangeValue,
          payload: {
            value: null,
            decode
          }
        }
      }

      return {
        type: ChangeValue,
        payload: {
          value,
          decode
        }
      }
    }

    default: {
      return {
        type: ChangeValue,
        payload: {
          value,
          decode
        }
      }
    }
  }

  //})())
  //}
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
  visibility: boolean,
  decode: T => string
): ToggleListAction {
  return {
    type: ToggleList,
    payload: {
      visibility,
      decode
    }
  }
}

export function togglePasswordVisibility(
  visibility: boolean
): TogglePasswordVisibilityAction {
  return {
    type: TogglePasswordVisibility,
    payload: {
      visibility: visibility
    }
  }
}

export const action = {
  change,
  turn,
  toggle,
  togglePasswordVisibility
}

/// HELPER

function encodeIpv4(str: string): string {
  return decodeIpv4(str).join(' . ')
}

function decodeIpv4(str: string): Array<string> {
  return str.split('.').map(n => n.trim())
}
