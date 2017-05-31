// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import debug from 'lib/debug-event-key'
import style from './style.css'
import type { Type, AutoComplete } from './types'
import Shadow from './view/Shadow'
import AC from './view/AutoComplete'

type Prop<T> = {
  // State
  value: string,
  autocomplete?: AutoComplete<T>,

  // Action
  boundChange: Function,
  boundTurn?: Function,

  // Required Options
  name: string,
  type: Type,

  // AutoComplete Options
  autocompleteValueDecode?: T => string,
  autocompleteList?: boolean,
  autocompleteRender?: React.Element<*>,
  autocompleteHighlight?: boolean,
  autocompleteShadow?: boolean,

  // Native Input Event
  onChange?: Function,
  onKeyDown?: Function,
  onBlur?: Function,
  prop: Array<any>
}

export function TextField<T>(props: Prop<T>): React.Element<*> {
  const {
    value,
    autocomplete,
    boundChange,
    boundTurn,

    name,
    type,

    autocompleteValueDecode,
    autocompleteRender,
    autocompleteList,
    autocompleteHighlight,
    autocompleteShadow,

    onChange,
    onKeyDown,
    onBlur,

    ...prop
  } = props

  const boundChangeWithType: Function = boundChange(type)

  function ShadowComponent(): ?React.Element<*> {
    if (!(autocomplete && autocompleteShadow && autocompleteValueDecode)) {
      return null
    }
    const { display } = autocomplete
    return (
      <Shadow decode={autocompleteValueDecode}>
        {display.find(x => Boolean(x.active))}
      </Shadow>
    )
  }

  function AutoCompleteComponent<T>(): ?React.Element<*> {
    if (!(autocomplete && autocompleteList)) {
      return null
    }
    const { display } = autocomplete
    return (
      <AC
        render={autocompleteRender}
        highlight={autocompleteHighlight}
        value={value}
        decode={autocompleteValueDecode}
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
        type="text"
        id={name}
        name={name}
        className={style.main}
        {...prop}
        onBlur={evt => {
          // TODO Auto push on blur

          // Pass to native blur
          if (typeof onBlur === 'function') {
            onBlur(evt)
          }
        }}
        onChange={evt => {
          boundChangeWithType(evt.target.value)

          // Pass to native change
          if (typeof onChange === 'function') {
            onChange(evt)
          }
        }}
        onKeyDown={evt => {
          // Debugger
          if (process.env.NODE_ENV === 'development') {
            console.log(`TextField: ${name}\n` + debug(evt))
          }

          // Build-in `C-l`
          if (evt.ctrlKey && evt.which === 76) {
            evt.preventDefault()
            boundChangeWithType('')
          }

          // AutoComplete Bind `Tab` key
          if (autocomplete && autocompleteValueDecode && evt.which === 9) {
            evt.preventDefault()
            const { display } = autocomplete
            if (display.length !== 0) {
              boundChangeWithType(
                autocompleteValueDecode(display.find(x => Boolean(x.active)))
              )
            }
          }

          // AutoComplete Bind `Up/Down` key
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

          // Pass to native keydown
          if (typeof onKeyDown === 'function') {
            onKeyDown(evt)
          }
        }}
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
