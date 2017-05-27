// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import eq from 'lodash/eq'
import identity from 'lodash/identity'
import ipv4 from 'lib/is-ipv4'
import {
  Change,
  PushToAutoCompleteList,
  RemoveAutoCompleteItem,
  ActiveAutoCompleteItem
} from './types'
import type {
  Model,
  Action,
  Type,
  AutoComplete,
  OnChangeAction,
  PushToAutoCompleteListAction,
  RemoveAutoCompleteItemAction,
  ActiveAutoCompleteItemAction
} from './types'

/// Update

export const initAutoComplete: AutoComplete<*> = {
  list: [],
  showList: [],
  suggest: false,
  autoPush: false,
  highlight: false,
  decode: identity,
  encode: identity
}

export const initModel: Model<*> = {
  value: '',
  type: 'text',
  name: '',
  autocomplete: null
}

export function update<T>(model: Model<T>, action: ?Action<T>): Model<T> {
  if (!action) return model

  switch (action.type) {
    case Change: {
      const value: string = action.payload

      if (!model.autocomplete) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[TextField] AutoComplete was not enabled.')
        }
        return Object.assign({}, model, {
          value: value
        })
      }

      const { list, showList, decode } = model.autocomplete

      if (list.length === 0) {
        return Object.assign({}, model, {
          value: value
        })
      }

      function filter(item: T): boolean {
        const regex: RegExp = new RegExp(`^${value}`)
        if (typeof item === 'string') {
          return Boolean(item.match(regex))
        }

        return Boolean(decode(item).match(regex))
      }

      return Object.assign({}, model, {
        value: value,
        autocomplete: {
          ...model.autocomplete,
          showList: list.filter(filter).sort()
        }
      })
    }

    case PushToAutoCompleteList: {
      if (!model.autocomplete) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[TextField] AutoComplete was not enabled.')
        }
        return model
      }

      const value: T = action.payload
      const { list, showList, decode } = model.autocomplete

      function filter(target: T): Function {
        return function(item: T): Boolean {
          return eq(decode(item), decode(target))
        }
      }

      if (list.filter(filter(value)).length !== 0) {
        return model
      }

      return Object.assign({}, model, {
        autocomplete: {
          ...model.autocomplete,
          list: [...list, value],
          showList: [...showList, value]
        }
      })
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
        payload: value
      }
  }
}

export function pushac<T>(value: T): PushToAutoCompleteListAction<T> {
  return {
    type: PushToAutoCompleteList,
    payload: value
  }
}

/// Helper

function encodeIpv4(str: string): string {
  return decodeIpv4(str).join(' . ')
}

function decodeIpv4(str: string): Array<string> {
  return str.split('.').map(n => n.trim())
}
