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
  transformer?: T => string,
  selectValue: Function,
  activeIdx: number
}

function AutoComplete<T>(props: Prop<T>): React.Element<*> {
  const {
    children,
    render,
    value,
    highlight,
    transformer,
    selectValue,
    activeIdx
  } = props
  const Component = render || Render
  return (
    <div className={style.container}>
      <ul className={style.list}>
        {children
          ? children.map((item, idx) => (
              <li key={idx}>
                <Component
                  selectValue={selectValue(item)}
                  isActive={idx === activeIdx}
                >
                  {highlight
                    ? <HighLight target={value}>
                        {transformer(item)}
                      </HighLight>
                    : item}
                </Component>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}

export default AutoComplete
