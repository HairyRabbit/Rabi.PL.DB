// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/** 
 * convert-action-type
 *
 * Encode/Decode component action type.
 */

export type Namespace = string
export type ComponentName = string
export type ActionType = string
export type CombinedActionType = string

export function encode(
  namespace: Namespace,
  componentName: ComponentName,
  actionType: ActionType
): CombinedActionType {
  return [namespace, componentName, actionType].join('/')
}

export function decode(
  combinedActionType: CombinedActionType
): [Namespace, ComponentName, ActionType] {
  return combinedActionType.split('/')
}
