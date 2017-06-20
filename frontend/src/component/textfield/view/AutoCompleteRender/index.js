// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'
import AutoCompleteItemRender from '../AutoCompleteItemRender'

type Prop = {
  children?: Array<*>,
  customItemRender?: React.Element<*>,
  onSelect?: Function
}

function AutoCompleteRender(props: Prop): React.Element<*> {
  const { children, customItemRender, onSelect } = props
  const ItemRender = customItemRender || AutoCompleteItemRender
  const decodeValue = x => x.value
  const items = children.map((n, idx) => {
    const val = decodeValue(n)
    return (
      <li
        key={idx}
        onMouseDown={evt => {
          if (onSelect) {
            onSelect(val)
          }
        }}
      >
        <ItemRender isActive={n.active}>
          {val}
        </ItemRender>
      </li>
    )
  })
  return (
    <ul className={style.container}>
      {items}
    </ul>
  )
}

export default AutoCompleteRender
