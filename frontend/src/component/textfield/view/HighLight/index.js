// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'

type Prop<T> = {
  children?: T,
  target: string,
  transformer?: T => string
}

// TODO if children is not a string
function HighLight<T>(props: Prop<T>): React.Element<*> {
  const { children, target, transformer } = props
  if (!children) return React.Children.only(null)
  const ctx: string = typeof children !== 'string' &&
    transformer &&
    typeof transformer === 'function'
    ? transformer(children)
    : JSON.stringify(children)
  const idx: number = ctx.indexOf(target)
  const len: number = target.length
  if (idx === -1) return React.Children.only(ctx)
  const left: string = ctx.slice(idx, len)
  const right: string = ctx.slice(len)
  return (
    <div>
      <span className={style.theme}>{left}</span>
      <span>{right}</span>
    </div>
  )
}

export default HighLight
