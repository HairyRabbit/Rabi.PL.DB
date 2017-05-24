// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import { connect } from 'react-redux'
import style from './style.css'
import type { Type } from './types'
import { clearInput } from './state'

type Prop = {
  name: string,
  type: Type,
  value: string,
  onChange: Function
}

export function TextField(props: Prop): React.Element<*> {
  const { name, type, value, dispatch, onChange, clearInput, onKeyDown } = props

  return (
    <div className={style.container}>
      <input
        value={value}
        type={type}
        id={name}
        name={name}
        onChange={onChange}
        onKeyDown={evt => {
          // C-l
          if (evt.ctrlKey && evt.which === 76) {
            evt.preventDefault()
            console.log(0)
            clearInput && clearInput()
            onKeyDown && onKeyDown()
          }
        }}
        className={style.main}
      />
    </div>
  )
}

export default TextField
