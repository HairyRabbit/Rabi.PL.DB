// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/** 
 * mapto-component-action
 *
 * Change the component action type.
 */

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

function warppedDispatch<A>(dispatch: Dispatch, type: string): Function {
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

function encodeActionType(
  namespace: string,
  flag: string,
  type: string
): string {
  return [namespace, flag, type].join('/')
}

function constAction<A>(
  actions: Actions<A>,
  type: string,
  flag: string,
  namespace: string
): Function {
  return function(): Function {
    const changedType: string = encodeActionType(namespace, flag, type)
    const actionCall: Object = actions[type].apply(null, arguments)

    return function(dispatch: Dispatch, ...args: Array<*>): Function | void {
      if (typeof actionCall !== 'function') {
        return combineAction(actionCall, changedType)
      }

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
    acc[encodeActionType(namespace, flag, curr)] = constAction(
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
  return Object.keys(actions).reduce(foldAction.apply(null, arguments), {})
}

export default mapToComponentAction
