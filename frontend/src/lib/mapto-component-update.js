// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

export default function updateComponentModel<Model, Action, Component>(
  model: Model,
  action: Action
): Function {
  return function(component: Component): Model {
    const [flag, componentAction] = action.type.split('@')
    const componentModel = component.update(
      model[flag],
      component[componentAction].apply(null, action.payload)
    )
    return {
      ...model,
      [flag]: componentModel
    }
  }
}
