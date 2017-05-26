// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'

type Prop = {
  children?: string
}

function Shadow(props: Prop): React.Element<*> {
  const { children } = props
  return (
    <div className={style.container}>
      {children}
    </div>
  )
}

export default Shadow
