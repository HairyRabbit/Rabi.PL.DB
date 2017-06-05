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

/* Auto complete */

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

export const PushToAutoCompleteList: 'PushToAutoCompleteList' =
  'PushToAutoCompleteList'
export type PushToAutoCompleteListAction<T> = {
  type: typeof PushToAutoCompleteList,
  payload: T
}

export const RemoveAutoCompleteItem: 'RemoveAutoCompleteItem' =
  'RemoveAutoCompleteItem'
export type RemoveAutoCompleteItemAction<T> = {
  type: typeof RemoveAutoCompleteItem,
  payload: T
}

export const ActiveAutoCompleteItem: 'ActiveAutoCompleteItem' =
  'ActiveAutoCompleteItem'
export type ActiveAutoCompleteItemAction = {
  type: typeof ActiveAutoCompleteItem,
  payload: number
}

export const ResetAutoComplete: 'ResetAutoComplete' = 'ResetAutoComplete'
export type ResetAutoCompleteAction = {
  type: typeof ResetAutoComplete
}

export type Action<T> =
  | ChangeValueAction<T>
  | TurnActiveAction
  | ToggleListAction
  | PushToAutoCompleteListAction<T>
  | RemoveAutoCompleteItemAction<T>
  | ActiveAutoCompleteItemAction
  | ResetAutoComplete

/// MODEL

export type Display<T> = {
  value: T,
  active: boolean
}

export type AutoComplete<T> = {
  list: Array<T>,
  display: Array<Display<T>>
}

export type Model<T> = {
  value: string,
  autocomplete?: AutoComplete<T>
}
