// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import type {
  Model,
  PasswordOption,
  TogglePasswordVisibilityAction
} from '../types'

export default function togglePasswordVisibility<T>(
  model: Model<T>,
  action: TogglePasswordVisibilityAction<T>
): Model<T> {
  const passopt: PasswordOption = model.passwordOption

  if (!passopt) {
    return model
  }

  const visibility: boolean = action.payload.visibility

  return {
    ...model,
    passwordOption: {
      ...passopt,
      visibility: visibility
    }
  }
}
