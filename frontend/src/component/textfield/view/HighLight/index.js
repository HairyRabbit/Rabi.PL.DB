// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'

type Prop<T> = {
  children?: T,
  target: T
}

// TODO if children is not a string
function HighLight<T>(props: Prop<T>): React.Element<*> {
  const { children, target } = props
  const idx: number = children.indexOf(target)
  const len: number = target.length
  if (idx === -1) return children
  const left: string = children.slice(idx, len)
  const right: string = children.slice(len)
  return (
    <div>
      <span className={style.theme}>{left}</span>
      <span>{right}</span>
    </div>
  )
}

export default HighLight
