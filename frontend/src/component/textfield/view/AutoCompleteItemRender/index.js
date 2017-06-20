// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'

type Prop = {
  children?: any,
  isActive: boolean
}

function AutoCompleteItemRender(props: Prop): React.Element<*> {
  // NOTE ItemRender aren't know how to decode value, it's just a lazy component
  const { children, isActive } = props

  const activedStyle: string = isActive
    ? [style.container, style.active].join(' ')
    : style.container

  return (
    <div className={activedStyle}>
      <div className={style.left}>
        <div className={style.circle} />
      </div>
      <div className={style.main}>
        {children}
      </div>
    </div>
  )
}

export default AutoCompleteItemRender
