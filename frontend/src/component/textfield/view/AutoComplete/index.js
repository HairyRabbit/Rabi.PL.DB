// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'
import HighLight from '../HighLight'

type Prop<T> = {
  children?: Array<T>,
  render: React.Element<*>,
  value: T,
  highlight: boolean
}

function AutoComplete<T>(props: Prop<T>): React.Element<*> {
  const { children, render, value, highlight } = props
  return (
    <div className={style.container}>
      <ul className={style.list}>
        {children
          ? children.map((item, idx) => (
              <li key={idx}>
                <render>
                  {highlight
                    ? <HighLight target={value}>{item}</HighLight>
                    : item}
                </render>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}

export default AutoComplete
