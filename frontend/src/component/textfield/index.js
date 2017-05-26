// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'
import type { Type } from './types'
import Shadow from './view/Shadow'
import AutoComplete from './view/AutoComplete'

type Prop = {
  name: string,
  type: Type,
  value: string,
  onChange: Function,
  onKeyDown?: Function,
  onBlur?: Function,
  autocompleted?: boolean,
  autocompletelist?: Array<any>,
  autocompleteItem?: React.Element<*>,
  autocompletePushOnBlur?: boolean,
  pushToAutoComplete?: Function,
  autocompleteHighLight?: boolean,
  autocompleteShadow?: boolean
}

export function TextField(props: Prop): React.Element<*> {
  const {
    name,
    type,
    value,
    onChange,
    onKeyDown,
    onBlur,
    autocompleted,
    autocompletelist,
    autocompleteItem,
    autocompletePushOnBlur,
    pushToAutoComplete,
    autocompleteHighLight,
    autocompleteShadow
  } = props

  const boundOnChange = onChange(type)

  const ShadowComponent: React.Element<*> = () =>
    autocompleted &&
      autocompleteShadow &&
      autocompletelist &&
      autocompletelist.length !== 0
      ? <Shadow>{autocompletelist[0]}</Shadow>
      : null

  const AutoCompleteComponent: React.Element<*> = () =>
    autocompleted
      ? <AutoComplete
          component={autocompleteItem}
          highlight={autocompleteHighLight}
          value={value}
        >
          {autocompletelist}
        </AutoComplete>
      : null

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
        onBlur={evt => {
          if (
            autocompleted &&
            autocompletePushOnBlur &&
            typeof pushToAutoComplete === 'function'
          ) {
            pushToAutoComplete()
          }

          if (typeof onBlur === 'function') {
            onBlur(evt)
          }
        }}
        onChange={boundOnChange}
        onKeyDown={evt => {
          // Debugger
          if (process.env.NODE_ENV === 'development') {
            console.log(
              `TextField: ${name}\n` +
                require('lib/pretty-print-table')['default'](`\
| key | code | ctrl | alt | meta | shift |
| ${evt.key} | ${evt.which} | ${evt.ctrlKey} | ${evt.altKey} | ${evt.metaKey} | ${evt.shiftKey} |
`)
            )
          }

          // Build-in `C-l`
          if (evt.ctrlKey && evt.which === 76) {
            evt.preventDefault()
            boundOnChange(makeValue(''))
          }

          // AutoComplete Bind `Tab` key
          if (autocompleted && evt.which === 9) {
            evt.preventDefault()
            if (
              Array.isArray(autocompletelist) &&
              autocompletelist.length > 0
            ) {
              boundOnChange(makeValue(autocompletelist[0]))
            }
          }

          // SPC helper key, auto fill
          if (evt.which === 32 && type === 'ipv4') {
            const value: string = evt.target.value
            const key: string = evt.target.key

            switch (type) {
              case 'ipv4': {
                let spcIdx = value.indexOf(' ')
                boundOnChange(makeValue(value + ' .'))
                break
              }

              default: {
                break
              }
            }
          }

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
