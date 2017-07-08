// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import { decode } from './convert-action-type'

export default function updateComponentModel<Model, Action, Component>(
  model: Model,
  action: CombinedAction<Action>,
  namespace: string
): Function {
  return function(component: Component): Model {
    const [_, componentName] = decode(action.type)
    const compnentModel: string = model[componentName]
    const componentAction: Action = {
      type: action._type,
      payload: action.payload
    }
    const mappedModel: Model = component.update(compnentModel, componentAction)

    return {
      ...model,
      [componentName]: mappedModel
    }
  }
}
