// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import { connect } from 'react-redux'
import style from './style.css'
import type { Type } from './types'

type Prop = {
  name: string,
  type: Type,
  value: string,
  onChange: Function,
  onKeyDown?: Function,
  onBlur?: Function,
  autocompleted?: boolean,
  autocompleteList?: Array<any>,
  autocompleteItem?: React.Element<*>,
  pushToAutoComplete?: Function
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
    autocompleteList,
    autocompleteItem,
    pushToAutoComplete
  } = props

  const boundOnChange = onChange(type)

  return (
    <div className={style.container}>
      <Icon />
      {autocompleted
        ? <List component={autocompleteItem}>{autocompleteList}</List>
        : null}

      <input
        value={value}
        type="text"
        id={name}
        name={name}
        onBlur={evt => {
          if (autocompleted && typeof pushToAutoComplete === 'function') {
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
              Array.isArray(autocompleteList) &&
              autocompleteList.length > 0
            ) {
              boundOnChange(makeValue(autocompleteList[0]))
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
        className={style.main}
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

function List(props): React.Element<*> {
  const { children, component } = props
  return (
    <div className={style.bottom}>
      <ul className={style.list}>
        {children
          ? children.map((item, idx) => (
              <li key={idx}>
                <component>{item}</component>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}

function makeValue(value: string): { target: { value: string } } {
  return { target: { value: value } }
}
