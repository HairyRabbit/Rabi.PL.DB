// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * textfield/state
 */

import eq from 'lodash/eq'
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
  OnChangeAction,
  PushToAutoCompleteListAction,
  RemoveAutoCompleteItemAction,
  ActiveAutoCompleteItemAction
} from './types'

/// Update

export const initModel: Model<*> = {
  value: '',
  type: 'text',
  name: '',
  autocompleted: false,
  autocompletelist: [],
  autocompletes: [],
  autocompletePushOnBlur: false,
  autocompleteHighLight: false,
  autocompleteShadow: false
}

export function update<T>(
  model: Model<T> = initModel,
  action: ?Action<T>
): Model<T> {
  if (!action) return model

  switch (action.type) {
    case Change: {
      const acs = model.autocompletes
      const value = action.payload
      return Object.assign({}, model, {
        value: value,
        autocompletelist: model.autocompleted === false
          ? acs
          : acs
              .filter(n => {
                // TODO replaced space to any
                //const val = value.replace(/\s/g, '\\\.')
                const val = value
                const regex = new RegExp(`^${val}`)
                return n.match(regex)
              })
              .sort()
      })
    }

    case PushToAutoCompleteList: {
      if (model.autocompleted === false) return model
      const { autocompletes: acs, autocompletelist: acl, value: item } = model
      if (acs.find(n => eq(n, item))) return model
      return Object.assign({}, model, {
        autocompletes: [...acs, item],
        autocompletelist: [...acl, item]
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

export function pushac<T>(): PushToAutoCompleteListAction<T> {
  return {
    type: PushToAutoCompleteList
  }
}

/// Helper

function encodeIpv4(str: string): string {
  return decodeIpv4(str).join(' . ')
}

function decodeIpv4(str: string): Array<string> {
  return str.split('.').map(n => n.trim())
}
