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
  onKeyDown?: Function
}

export function TextField(props: Prop): React.Element<*> {
  const { name, type, value, onChange, onKeyDown } = props

  const boundOnChange = onChange(type)

  return (
    <div className={style.container}>
      <div className={style.left}>
        <div className={style.circle} />
      </div>
      <input
        value={value}
        type="text"
        id={name}
        name={name}
        onChange={boundOnChange}
        onKeyDown={evt => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`KeyCode: ${evt.which}`)
          }

          // C-l build-in
          if (evt.ctrlKey && evt.which === 76) {
            evt.preventDefault()
            boundOnChange(makeValue(''))
          }

          // SPC
          // if(typeof autoFill === 'function' && evt.which === 32) {
          //   autoFill()
          // }

          if (typeof onKeyDown === 'function') {
            onKeyDown()
          }
        }}
        className={style.main}
      />
    </div>
  )
}

export default TextField

function makeValue(value: string): { target: { value: string } } {
  return { target: { value: value } }
}
