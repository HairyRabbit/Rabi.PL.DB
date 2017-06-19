// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

function decodeActionType(props: string): string {
  return props.split('/')
}

export default function updateComponentModel<Model, Action, Component>(
  model: Model,
  action: CombinedAction<Action>,
  namespace: string
): Function {
  return function(component: Component): Model {
    const [_, flag] = decodeActionType(action.type)
    const compnentModel: string = model[flag]
    const componentAction: Action = {
      type: action._type,
      payload: action.payload
    }
    const mappedModel: Model = component.update(compnentModel, componentAction)
    return {
      ...model,
      [flag]: mappedModel
    }
  }
}
