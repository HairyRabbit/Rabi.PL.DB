// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'
import HighLight from '../HighLight'
import Render from '../Render'

type Prop<T> = {
  children?: Array<T>,
  render?: ?React.Element<*>,
  value: string,
  highlight: boolean,
  decode?: T => string
}

function AutoComplete<T>(props: Prop<T>): React.Element<*> {
  const { children, render, value, highlight, decode } = props
  const Component = render || Render
  return (
    <div className={style.container}>
      <ul className={style.list}>
        {children && children.length !== 0
          ? children.map((item, idx) => (
              <li key={idx}>
                <Component isActive={item.active}>
                  {highlight
                    ? <HighLight target={value}>
                        {decode(item)}
                      </HighLight>
                    : decode(item)}
                </Component>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}

export default AutoComplete
