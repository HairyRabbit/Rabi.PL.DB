// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/// TYPES

export type Type =
  | 'text'
  | 'password'
  | 'number'
  | 'tel'
  | 'mail'
  | 'datetime'
  | 'date'
  | 'time'
  | 'url'
  | 'bank'
  | 'idcard'
  | 'color'
  | 'ipv4'
  | 'port'

export type Direction = 1 | -1

/// MSG

export const ChangeValue: 'ChangeValue' = 'ChangeValue'
export type ChangeValueAction<T> = {
  type: typeof ChangeValue,
  payload: {
    value: string,
    decode?: T => string
  }
}

// auto-complete
export const TurnActive: 'TurnSuggestActive' = 'TurnSuggestActive'
export type TurnActiveAction = {
  type: typeof TurnActive,
  payload: {
    direction: Direction
  }
}

export const ToggleList: 'ToggleList' = 'ToggleList'
export type ToggleListAction = {
  type: typeof ToggleList,
  payload: {
    visibility: boolean,
    decode?: T => string
  }
}

// password options
export const TogglePasswordVisibility: 'TogglePasswordVisibility' =
  'TogglePasswordVisibility'
export type TogglePasswordVisibilityAction = {
  type: typeof TogglePasswordVisibility,
  payload: {
    visibility: boolean
  }
}

export type Action<T> =
  | ChangeValueAction<T>
  | TurnActiveAction
  | ToggleListAction
  | TogglePasswordVisibilityAction

/// MODEL

export type Display<T> = {
  value: T,
  active: boolean
}

export type AutoComplete<T> = {
  list: Array<T>,
  display: Array<Display<T>>
}

export type PasswordStrength =
  | 1 // week
  | 2 // medium
  | 3 // strong
  | 4 // super

export type PasswordError = {
  tooShort: boolean,
  noNumber: boolean,
  noChar: boolean,
  tooLong: boolean,
  specialChar: boolean
}

export type PasswordOption = {
  visibility: boolean,
  strength: ?PasswordStrength,
  error: ?PasswordError
}

export type Model<T> = {
  value: string,
  autocomplete?: AutoComplete<T>,
  passwordOption?: PasswordOption
}
