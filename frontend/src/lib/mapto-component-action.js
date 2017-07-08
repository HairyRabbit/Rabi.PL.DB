// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/** 
 * mapto-component-action
 *
 * Change the component action type.
 *
 * 1. Package component level action object to page level.
 *
 * Example:
 *
 * ```js
 * {
 *   type: ActionType,
 *   payload: ActionPayload,
 * }
 *
 * // package to ...
 *
 * {
 *   type: CombinedActionType,
 *   _type: ActionType,
 *   payload: ActionPayload
 * }
 * ```
 *
 * 2. Pass `dispatch` to the async action thunk.
 *
 * Work with component async action.
 *
 * TODO use redux middleware replace this.
 */

import { encode } from './convert-action-type'
import type { Dispatch, ThunkAction } from './thunk-type'

type CombinedAction<A> = {
  type: string,
  payload: $PropertyType<A, 'payload'>,
  _type: $PropertyType<A, 'type'>
}

type Actions<A> = {
  [string]: A
}

type CombinedActions<A> = {
  [string]: CombinedAction<A>
}

function warppedDispatch<A>(dispatch: Dispatch<A>, type: string): Function {
  return function(action: A): void {
    dispatch(combineAction(action, type))
  }
}

function combineAction<A>(action: A, type: string): CombinedAction<A> {
  return {
    ...action,
    type,
    _type: action.type
  }
}

function constAction<A>(
  actions: Actions<A>,
  type: string,
  flag: string,
  namespace: string
): Function {
  return function(): CombinedAction<A> | ThunkAction<A> {
    const changedType: string = encode(namespace, flag, type)
    const actionCall: Object = actions[type].apply(null, arguments)

    if (typeof actionCall !== 'function') {
      return combineAction(actionCall, changedType)
    }
    return function(dispatch: Dispatch, ...args: Array<*>): void {
      actionCall.apply(null, [warppedDispatch(dispatch, changedType), ...args])
    }
  }
}

function foldAction<A>(
  actions: Action<A>,
  flag: string,
  namespace: string
): Function {
  return function(acc: Actions, curr: string): CombinedActions<A> {
    acc[encode(namespace, flag, curr)] = constAction(
      actions,
      curr,
      flag,
      namespace
    )
    return acc
  }
}

function mapToComponentAction<A>(
  actions: Actions<A>,
  flag: string,
  namespace: string
): CombinedActions<A> {
  const folder = foldAction.apply(null, arguments)
  return Object.keys(actions).reduce(folder, {})
}

export default mapToComponentAction
