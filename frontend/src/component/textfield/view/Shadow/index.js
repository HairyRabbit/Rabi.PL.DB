// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'

type Prop<T> = {
  children?: string,
  decode: T => string
}

function Shadow<T>(props: Prop<T>): ?React.Element<*> {
  const { children, decode } = props
  return (
    <div className={style.container}>
      {children ? decode(children) : null}
    </div>
  )
}

export default Shadow
