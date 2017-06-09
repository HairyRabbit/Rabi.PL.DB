// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

type ActionType = string

type Action = {
  type: string,
  payload: any
}

type Actions = {
  [ActionType]: Action
}

function constAction(type: string): Function {
  return function(): Action {
    return {
      type,
      payload: arguments
    }
  }
}

function combineActionType(flag: string): Function {
  return function(actionName: string): ActionType {
    return [flag, '@', String(actionName)].join('')
  }
}

function combineAction(acc: Actions, curr: string): Actions {
  acc[curr] = constAction(curr)
  return acc
}

export default function mapToComponentAction<ComponentAction>(
  flag: string,
  actions: { [string]: ComponentAction }
): Actions {
  return Object.keys(actions)
    .map(combineActionType(flag))
    .reduce(combineAction, {})
}
