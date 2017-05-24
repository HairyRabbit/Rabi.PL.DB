// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * textfield/types
 *
 * Component textfield types.
 */

/// Msg

// textfield type
export type Type =
  | 'text'
  | 'password'
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

// textfiled value change
export const Change: 'Change' = 'Change'
export const ClearClearInput: 'ClearInput' = 'ClearInput'

export type OnChangeAction = {
  type: typeof Change,
  payload: string
}

export type ClearInputAction = {
  type: typeof ClearInput
}

export type Action = OnChangeAction | ClearInputAction

/// Model

export type Model = {
  value: ?string
}
