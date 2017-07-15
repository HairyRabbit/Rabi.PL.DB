// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import style from './style.css'

console.log(style)

function Avatar(props: Prop): React.Element<*> {
  const { src } = props

  //const isFile = /^(https|http)/.test(src)
  //const images = <img src={require('image/avatar.jpg')} />

  return (
    <div className={style.container}>
      <img className={style.image} src={src} />
    </div>
  )
}

export default Avatar
