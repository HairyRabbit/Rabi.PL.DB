// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import { connect } from 'react-redux'
import style from './style.css'

export function TextField(props) {
  const { id, type, value, onChange } = props

  return (
    <input
      value={value}
      type={type}
      id={id}
      name={id}
      onChange={onChange}
      className={style.main}
    />
  )
}

export default TextField
