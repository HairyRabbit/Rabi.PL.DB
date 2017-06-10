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

type Prop<T> = {
  // STATE
  value: string,
  autocomplete?: AutoComplete<T>,
  passwordOption: PasswordOption,

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

    onChange,
    onKeyDown,
    //onFocus,
    onBlur,

    ...prop
  } = props

  const boundChangeWithType: Function = boundChange(type)

  // Shadow
  function ShadowComponent(): ?React.Element<*> {
    if (
      !(type !== 'password' &&
        autocomplete &&
        autocompleteShadow &&
        autocompleteValueDecode)
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
        highlight={autocompleteHighlight}
        value={value}
        decode={autocompleteValueDecode}
        onSelect={boundChangeWithType}
      >
        {autocomplete.display}
      </AC>
    )
  }

  return (
    <div className={style.container}>
      <Icon />
      <AutoCompleteComponent />
      <ShadowComponent />

      <input
        value={value}
        type={matchType(props)}
        id={name}
        name={name}
        className={style.main}
        {...prop}
        onFocus={bindHandle(props.onFocus, evt => {
          if (autocomplete && autocompleteList) {
            boundToggle(autocompleteValueDecode, true)
          }
        })}
        onBlur={bindHandle(props.onBlur, evt => {
          if (autocomplete && autocompleteList) {
            boundToggle(autocompleteValueDecode, false)
          }
          // TODO Auto push on blur
        })}
        onChange={bindHandle(props.onChange, evt => {
          boundChangeWithType(evt.target.value)
        })}
        onKeyDown={bindHandle(props.onKeyDown, evt => {
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

          // SPC helper key, auto fill
          // if (evt.which === 32 && type === 'ipv4') {
          //   const value: string = evt.target.value
          //   const key: string = evt.target.key

          //   switch (type) {
          //     case 'ipv4': {
          //       let spcIdx = value.indexOf(' ')
          //       boundOnChange(makeValue(value + ' .'))
          //       break
          //     }

          //     default: {
          //       break
          //     }
          //   }
          // }
        })}
      />
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
