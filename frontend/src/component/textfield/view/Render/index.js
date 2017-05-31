// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'

type Prop<T> = {
  children?: T,
  selectValue: Function,
  isActive: boolean
}

function Render<T>(props: Prop<T>): React.Element<*> {
  const { children, selectValue, isActive } = props

  const activedStyle: string = isActive
    ? [style.container, style.active].join(' ')
    : style.container

  return (
    <div className={activedStyle} onClick={selectValue}>
      <div className={style.left}>
        <div className={style.circle} />
      </div>
      <div className={style.main}>
        {children}
      </div>
    </div>
  )
}

export default Render
