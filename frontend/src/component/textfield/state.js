// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import eq from 'lodash/eq'
import identity from 'lodash/identity'
import uniq from 'lodash/uniq'
import ipv4 from 'lib/is-ipv4'
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

const initPasswordError = {
  tooShort: true,
  noNumber: true,
  noChar: true,
  tooLong: false,
  specialChar: false
}

const initPasswordStrength = 1

export const initPasswordOption: PasswordOption = {
  visibility: false,
  strength: null,
  error: null
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
      return {
        type: ChangeValue,
        payload: {
          value,
          decode,
          strength: computePasswordStrength(value),
          error: computePasswordError(value)
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

function computePasswordError(value: string): PasswordError {
  const len: number = value.length
  let error: PasswordError = initPasswordError

  if (len < 8) {
    return { ...error, tooShort: true }
  }

  // TODO
  // if(len > 20) {
  //   return { ...error, tooLong: true }
  // }

  if (!/\d+/.test(value)) {
    return { ...error, noNumber: true }
  }

  if (!/[a-zA-Z]+/.test(value)) {
    return { ...error, noChar: true }
  }

  // TODO
  // if(!/[\s]+/.test(value)) {
  //   return { ...error, specialChar: true }
  // }

  return null
}

function computePasswordStrength(value: string): PasswordStrength {
  // NOTE
  //
  // Length
  // < 8 0
  // 8 - 10 10
  // 10 - 12 10
  // 12 - 15 10
  // > 15 10
  //
  // Number
  // no one 0
  // has number 10
  // not begin with number 10
  //
  // Chars
  // no one 0
  // has char 10
  // lowercase + uppercase 10
  //
  // Symbol
  // no one 0
  // !@#$%^&*._ only one 10
  // more then one and different 20

  // Sum
  // week less then 40
  // medium 40 - 60
  // strong 60 - 90
  // super 90 - 100

  const len: number = value.length
  let lenSource: number = 0
  if (len > 10 && len <= 12) {
    lenSource = 20
  } else if (len > 12 && len <= 15) {
    lenSource = 30
  } else if (len > 15) {
    lenSource = 40
  } else if (len > 8 && len <= 10) {
    lenSource = 10
  } else {
    lenSource = 0
  }

  let numberSource: number = 0
  if (/\d+/.test(value) && !/^\d/.test(value)) {
    numberSource = 20
  } else if (/\d+/.test(value)) {
    numberSource = 10
  } else {
    numberSource = 0
  }

  let charSource: number = 0
  if (/[A-Z]+/.test(value) && /[a-z]+/.test(value)) {
    charSource = 20
  } else if (/[A-Z]+/.test(value) || /[a-z]+/.test(value)) {
    charSource = 10
  } else {
    charSource = 0
  }

  let symbolSource: number = 0
  const matchSymbol = value.match(/[!|@|#|$|%|^|&|*|\.|_]{1}/g)
  if (!matchSymbol) {
    symbolSource = 0
  } else if (uniq(matchSymbol).length === 1) {
    symbolSource = 10
  } else {
    symbolSource = 20
  }

  const sum: number = lenSource + numberSource + charSource + symbolSource
  if (sum <= 40) {
    return 1
  } else if (sum <= 60) {
    return 2
  } else if (sum <= 90) {
    return 3
  } else {
    return 4
  }
}
