// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import groupBy from 'lodash/groupBy'
import { mapPasswordErrorLabelToString } from 'lib/mapto-password-error'
import type { PasswordError, ErrorType } from 'lib/mapto-password-error'
import style from './style.css'

type PasswordErrorArray = [$Keys<PasswordError>, ErrorType]

type Prop = {
  errors: PasswordError
}

export default function PasswordHelper(props: Prop): React.Element<*> {
  const { errors } = props
  const arr: PasswordErrorArray = Object.keys(errors).map(key => {
    return {
      ...errors[key],
      label: key
    }
  })
  const { should, never } = groupBy(arr, 'type')
  const neverArr = never.filter(x => Boolean(x.value))

  return (
    <div className={style.container}>
      <ul className={style.list}>{should.map(mapToItem(HelperItem))}</ul>
      {neverArr.length !== 0
        ? <ul className={[style.list, style.nextList].join(' ')}>
            {neverArr.map(mapToItem(ErrorItem))}
          </ul>
        : null}
    </div>
  )
}

function mapToItem(Item) {
  return function(item, idx) {
    return (
      <li key={idx}>
        <Item label={item.label} value={item.value} />
      </li>
    )
  }
}

function HelperItem(props) {
  const { label, value } = props
  const completedStyle = !value ? style.completed : ''

  return (
    <div className={[style.item, completedStyle].join(' ')}>
      <div className={style.left}>
        <div className={style.circle} />
      </div>
      <div className={style.main}>
        {mapPasswordErrorLabelToString(label, null)}
      </div>
    </div>
  )
}

function ErrorItem(props) {
  const { label, value } = props
  const activeStyle = Boolean(value) ? style.active : ''

  return (
    <div className={[style.item, activeStyle].join(' ')}>
      <div className={style.left}>
        <div className={style.circle} />
      </div>
      <div className={style.main}>
        {mapPasswordErrorLabelToString(label, value)}
      </div>
    </div>
  )
}
