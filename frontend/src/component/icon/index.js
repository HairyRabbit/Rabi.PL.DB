// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'

export default function Icon({ name, size = '1rem' }) {
  const fixedSize = {
    maxWidth: size,
    maxHeight: size
  }

  if (process.env.NODE_ENV === 'production') {
    //const icons = require(`style/iconfont`)
    return (
      <span
        className={classnames(style.icon, icons.container, icons[name])}
        style={fixedSize}
      />
    )
  } else {
    const Component = require(`icon/${name}.svg`).default
    return (
      <Component
        className={[style.icon, style.iconImg].join(' ')}
        style={fixedSize}
      />
    )
  }
}
