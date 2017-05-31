// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import eq from 'lodash/eq'
import identity from 'lodash/identity'
import ipv4 from 'lib/is-ipv4'
import {
  Change,
  TurnActive,
  PushToAutoCompleteList,
  RemoveAutoCompleteItem,
  ActiveAutoCompleteItem,
  ResetAutoComplete
} from './types'
import type {
  Model,
  Action,
  Type,
  AutoComplete,
  Display,
  Direction,
  OnChangeAction,
  TurnActiveAction,
  PushToAutoCompleteListAction,
  RemoveAutoCompleteItemAction,
  ActiveAutoCompleteItemAction,
  ResetAutoCompleteAction
} from './types'

/// Update

export const initAutoComplete: AutoComplete<*> = {
  list: [],
  display: []
}

export const initModel: Model<*> = {
  value: ''
}

export function update<T>(model: Model<T>, action: Action<T>): Model<T> {
  switch (action.type) {
    case Change: {
      const value: string = action.payload.value

      // value no changed
      if (value === initModel.value || value === model.value) {
        return model
      }

      const ac: ?AutoComplete<T> = model.autocomplete

      // basic set value
      if (!ac) {
        return { ...model, value: value }
      }

      const list: Array<T> = ac.list

      // empty ac list
      if (list.length === 0) {
        return { ...model, value: value }
      }

      const decode: T => string = action.payload.decode || identity

      // matched value
      function matched(item: T): boolean {
        const regex: RegExp = new RegExp(`^${value}`)
        return Boolean(decode(item).match(regex))
      }

      // map to display list
      function mapToDisplay(item: T): { value: T, active: boolean } {
        return {
          value: item,
          active: false
        }
      }

      return {
        ...model,
        value: value,
        autocomplete: {
          ...ac,
          display: list.filter(matched).sort().map(mapToDisplay)
        }
      }
    }

    case TurnActive: {
      const ac: ?AutoComplete<T> = model.autocomplete

      // not enable ac
      if (!ac) {
        return model
      }

      const list: Array<T> = ac.list

      // empty list
      if (list.length === 0) {
        return model
      }

      const display: Array<Display<T>> = ac.display
      const len: number = display.length

      // empty display list
      if (len === 0) {
        return model
      }

      function mapActive<T>(activep: boolean): Function {
        return function(item: Display<T>): Display<T> {
          return {
            ...item,
            active: activep
          }
        }
      }

      // only one item
      if (len === 1) {
        return {
          ...model,
          autocomplete: {
            ...ac,
            display: display.map(mapActive(true))
          }
        }
      }

      const idx: number = display.findIndex(item => Boolean(item.active))
      const dir: Direction = action.payload.direction
      let next: number

      switch (dir) {
        case 1: {
          if (idx === -1) {
            next = 0
          } else {
            next = idx + 1 > display.length - 1 ? 0 : idx + 1
          }
          break
        }
        case -1: {
          if (idx === -1) {
            next = display.length - 1
          } else {
            next = idx - 1 < 0 ? display.length - 1 : idx - 1
          }
          break
        }
        default: {
          next = 0
          break
        }
      }

      const di: Array<Display<T>> = display.map(mapActive(false))

      return {
        ...model,
        autocomplete: {
          ...ac,
          display: [
            ...di.slice(0, next),
            mapActive(true)(di[next]),
            ...di.slice(next + 1)
          ]
        }
      }
    }

    default: {
      return model
    }
  }
}

/// Action

export function onChange(value: string, type: Type): OnChangeAction {
  switch (type) {
    case 'ipv4': {
      // Fixed backspace keypress can't delete chats.
      return {
        type: Change,
        payload: value.slice(-1) === '.' ? value : encodeIpv4(value)
      }
    }

    default:
      return {
        type: Change,
        payload: {
          value
        }
      }
  }
}

export function pushac<T>(value: T): PushToAutoCompleteListAction<T> {
  return {
    type: PushToAutoCompleteList,
    payload: value
  }
}

export function activeac(dir: number): ActiveAutoCompleteItemAction {
  return {
    type: ActiveAutoCompleteItem,
    payload: dir
  }
}

export function resetac(): ResetAutoCompleteAction {
  return {
    type: ResetAutoComplete
  }
}

/// Helper

function encodeIpv4(str: string): string {
  return decodeIpv4(str).join(' . ')
}

function decodeIpv4(str: string): Array<string> {
  return str.split('.').map(n => n.trim())
}
