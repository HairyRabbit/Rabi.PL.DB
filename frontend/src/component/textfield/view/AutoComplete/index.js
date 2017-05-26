// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'
import HighLight from '../HighLight'

type Prop<T> = {
  children?: Array<T>,
  render?: ?React.Element<*>,
  value: string,
  highlight: boolean,
  transformer?: T => string
}

function DefaultRender({ children }) {
  return <div>{children}</div>
}

function AutoComplete<T>(props: Prop<T>): React.Element<*> {
  const { children, render, value, highlight, transformer } = props
  const component = render || DefaultRender
  return (
    <div className={style.container}>
      <ul className={style.list}>
        {children
          ? children.map((item, idx) => (
              <li key={idx}>
                <component>
                  {highlight
                    ? <HighLight target={value} transformer={transformer}>
                        {item}
                      </HighLight>
                    : item}
                </component>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}

export default AutoComplete
