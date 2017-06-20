// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import debug from 'lib/debug-event-key'
import bindHandle from 'lib/bind-native-eventhandle'
import style from './style.css'
import type { Type, AutoComplete, PasswordOption } from './types'
import Shadow from './view/Shadow'
import AC from './view/AutoComplete'
import PasswordHelper from './view/PasswordHelper'
import PasswordStrength from './view/PasswordStrength'
import Map from './view/Map'

type AutocompleteProp = boolean | 'list' | 'shadow'

type Prop<T> = {
  // STATE
  value: string,
  autocomplete?: AutoComplete<T>,
  passwordOption?: PasswordOption,

  // ACTION
  boundChange: Function,
  boundTurn?: Function,
  boundToggle?: Function,
  boundTogglePasswordVisibility?: Function,

  // OPTIONS
  name: string,
  type: Type,

  // OPTIONS.AutoComplete
  autocompleteValueDecode?: T => string,
  autocompleteList?: boolean,
  autocompleteRender?: React.Element<*>,
  autocompleteHighlight?: boolean,
  autocompleteShadow?: boolean,

  // OPTIONS.CityType
  map: boolean,

  // OPTIONS.native
  prop: Array<any>
}

export function TextField<T>(props: Prop<T>): React.Element<*> {
  const {
    value,
    autocomplete,
    passwordOption,
    boundChange,
    boundTurn,
    boundToggle,
    boundTogglePasswordVisibility,

    name,
    type,

    autocompleteValueDecode,
    autocompleteRender,
    autocompleteList,
    autocompleteHighlight,
    autocompleteShadow,

    map,

    ...prop
  } = props

  const boundChangeWithType: Function = boundChange(type)

  // Shadow
  function ShadowComponent(): ?React.Element<*> {
    if (
      !(
        type !== 'password' &&
        autocomplete &&
        autocompleteShadow &&
        autocompleteValueDecode
      )
    ) {
      return null
    }
    const { display } = autocomplete
    return (
      <Shadow decode={autocompleteValueDecode}>
        {display.find(x => Boolean(x.active))}
      </Shadow>
    )
  }

  // AutoComplete
  function AutoCompleteComponent<T>(): ?React.Element<*> {
    if (!(autocomplete && autocompleteList)) {
      return null
    }
    return (
      <AC
        render={autocompleteRender}
        highlight={Boolean(autocompleteHighlight)}
        value={value}
        decode={autocompleteValueDecode}
        onSelect={boundChangeWithType}
        customRender={props => <Map {...props} width={200} height={200} />}
      >
        {autocomplete.display}
      </AC>
    )
  }

  // Password Helper
  function PasswordHelperComponent(): ?React.Element<*> {
    if (!passwordOption) {
      return null
    }

    return <PasswordHelper errors={passwordOption.error} />
  }

  // Password Strength
  function PasswordStrengthComponent(): ?React.Element<*> {
    if (!(passwordOption && passwordOption.strength)) {
      return null
    }

    return <PasswordStrength strength={passwordOption.strength} />
  }

  return (
    <div className={style.container}>
      <Icon />
      <AutoCompleteComponent />
      <ShadowComponent />
      <PasswordHelperComponent />
      <PasswordStrengthComponent />

      <input
        value={value}
        type={matchType(props)}
        id={name}
        name={name}
        className={style.main}
        {...prop}
        onFocus={bindHandle(prop.onFocus, evt => {
          if (autocomplete && autocompleteList && boundToggle) {
            boundToggle(autocompleteValueDecode, true)
          }
        })}
        onBlur={bindHandle(prop.onBlur, evt => {
          if (autocomplete && autocompleteList && boundToggle) {
            boundToggle(autocompleteValueDecode, false)
          }
          if (type === 'number') {
            if (value === '-') {
              boundChangeWithType('0')
            }
          }
          // TODO Auto push on blur
        })}
        onChange={bindHandle(prop.onChange, evt => {
          boundChangeWithType(evt.target.value)
        })}
        onWheel={bindHandle(prop.onWheel, evt => {
          // NOTE Build-in Change numbe value
          if (type === 'number') {
            evt.preventDefault()
            const val: number = Number(evt.target.value)
            const { step, min, max, reverse } = prop
            const computeVal: number = keepNumber(
              fineTuneNumberOnWhell(evt, val, Boolean(reverse), step)
            )
            let scopeVal: number = computeVal
            if (min !== undefined) {
              scopeVal = Math.max(min, scopeVal)
            }
            if (max !== undefined) {
              scopeVal = Math.min(max, scopeVal)
            }
            boundChangeWithType(String(scopeVal))
          }
        })}
        onKeyDown={bindHandle(prop.onKeyDown, evt => {
          // NOTE Debugger
          if (process.env.NODE_ENV === 'development') {
            console.log(`TextField: ${name}\n` + debug(evt))
          }

          // NOTE Build-in `C-l` Clear input
          if (evt.ctrlKey && evt.which === 76) {
            evt.preventDefault()
            boundChangeWithType('')
          }

          // NOTE Build-in `C-/` Password type hidden/visible input
          if (
            type === 'password' &&
            passwordOption &&
            boundTogglePasswordVisibility &&
            (evt.ctrlKey && evt.which === 191)
          ) {
            evt.preventDefault()
            // TODO
            boundTogglePasswordVisibility(!passwordOption.visibility)
          }

          // NOTE AutoComplete Bind `Tab` key
          if (
            autocomplete &&
            (autocompleteShadow || autocompleteList) &&
            autocompleteValueDecode &&
            evt.which === 9
          ) {
            evt.preventDefault()
            const { display } = autocomplete
            if (display.length !== 0) {
              boundChangeWithType(
                autocompleteValueDecode(display.find(x => Boolean(x.active)))
              )
            }
          }

          // NOTE AutoComplete Bind `Up/Down` key
          if (
            autocomplete &&
            boundTurn &&
            (evt.which === 38 ||
              evt.which === 40 ||
              (evt.altKey && evt.which === 191))
          ) {
            evt.preventDefault()
            const dir: number = evt.which === 38 ? -1 : 1
            boundTurn(dir)
          }
        })}
      />

      {/**/}

    </div>
  )
}

export default TextField

function Icon() {
  return (
    <div className={style.left}>
      <div className={style.circle} />
    </div>
  )
}

function makeValue(value: string): { target: { value: string } } {
  return { target: { value: value } }
}

function matchType({ type, passwordOption }): string {
  switch (type) {
    case 'password': {
      if (!passwordOption) {
        return 'password'
      }
      return passwordOption.visibility ? 'text' : 'password'
    }
    default:
      return 'text'
  }
}

function fineTuneNumberOnWhell(
  evt: Event,
  value: number,
  reverse: boolean,
  step?: number
): number {
  function mapToValue(multiple: number): number {
    return (!reverse ? evt.deltaY < 0 : evt.deltaY > 0)
      ? value + multiple
      : value - multiple
  }

  switch (true) {
    case Boolean(step): {
      return mapToValue(step)
    }
    case evt.ctrlKey: {
      return mapToValue(100)
    }
    case evt.shiftKey: {
      return mapToValue(10)
    }
    case evt.altKey: {
      return mapToValue(0.1)
    }
    default: {
      return mapToValue(1)
    }
  }
}

function keepNumber(value: number): number {
  return Number(value.toFixed(12))
}
