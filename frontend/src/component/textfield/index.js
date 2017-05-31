// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import debug from 'lib/debug-event-key'
import style from './style.css'
import type { Type, AutoComplete } from './types'
import Shadow from './view/Shadow'
import AC from './view/AutoComplete'

type Prop<T> = {
  name: string,
  type: Type,
  value: string,
  autocomplete?: AutoComplete<T>,
  autocompleteRender?: React.Element<*>,
  initAutoComplete: Function,
  pushToAutoComplete: Function,
  changeValue: Function,
  activeAutoComplete: Function,
  resetAutoComplete: Function,
  onChange?: Function,
  onKeyDown?: Function,
  onBlur?: Function,
  prop: Array<any>
}

export function TextField<T>(props: Prop<T>): React.Element<*> {
  const {
    name,
    type,
    value,
    autocomplete,
    autocompleteRender,
    initAutoComplete,
    pushToAutoComplete,
    changeValue,
    activeAutoComplete,
    resetAutoComplete,
    onChange,
    onKeyDown,
    onBlur,
    ...prop
  } = props

  const boundOnChange: Function = changeValue(type)

  function ShadowComponent(): ?React.Element<*> {
    if (!autocomplete) {
      return null
    }
    const { suggest, decode, showList, matchidx } = autocomplete
    if (!suggest) {
      return null
    }
    if (matchidx !== -1) {
      return null
    }
    if (showList.length === 0) {
      return null
    }
    return <Shadow>{decode(showList[0])}</Shadow>
  }

  function AutoCompleteComponent<T>(): ?React.Element<*> {
    if (!autocomplete) {
      return null
    }
    const { highlight, showList, decode, matchidx } = autocomplete
    return (
      <AC
        render={autocompleteRender}
        highlight={autocomplete.highlight}
        value={value}
        transformer={decode}
        selectValue={value => () => boundOnChange(makeValue(decode(value)))}
        activeIdx={matchidx}
      >
        {autocomplete.showList}
      </AC>
    )
  }

  return (
    <div className={style.container}>
      <Icon />
      <AutoCompleteComponent />
      <ShadowComponent />

      <input
        value={value}
        type="text"
        id={name}
        name={name}
        className={style.main}
        {...prop}
        onBlur={evt => {
          // Auto push on blur
          if (
            autocomplete &&
            autocomplete.autoPush &&
            pushToAutoComplete &&
            typeof pushToAutoComplete === 'function'
          ) {
            pushToAutoComplete(value)
          }

          // if(autocomplete && autocomplete.matchidx !== -1) {
          //   resetAutoComplete()
          // }

          // Pass to native blur
          if (typeof onBlur === 'function') {
            onBlur(evt)
          }
        }}
        onChange={evt => {
          boundOnChange(evt)

          // Pass to native change
          if (typeof onChange === 'function') {
            onChange(evt)
          }
        }}
        onKeyDown={evt => {
          // Debugger
          if (process.env.NODE_ENV === 'development') {
            console.log(`TextField: ${name}\n` + debug(evt))
          }

          // Build-in `C-l`
          if (evt.ctrlKey && evt.which === 76) {
            evt.preventDefault()
            boundOnChange(makeValue(''))
          }

          // AutoComplete Bind `Tab` key
          if (autocomplete && evt.which === 9) {
            evt.preventDefault()
            const { decode, showList, matchidx } = autocomplete
            if (showList.length !== 0) {
              boundOnChange(makeValue(decode(showList[0])))
            }
          }

          // AutoComplete Bind `Up/Down` key
          if (autocomplete && (evt.which === 38 || evt.which === 40)) {
            evt.preventDefault()
            const updown: number = evt.which === 38 ? -1 : 1
            activeAutoComplete(updown)
            const { decode, showList, matchidx } = autocomplete
            console.log(matchidx)
            if (matchidx !== -1 && showList.length !== 0) {
              boundOnChange(makeValue(decode(showList[matchidx])))
            }
          } else {
            resetAutoComplete()
          }

          // SPC helper key, auto fill
          if (evt.which === 32 && type === 'ipv4') {
            const value: string = evt.target.value
            const key: string = evt.target.key

            switch (type) {
              case 'ipv4': {
                let spcIdx = value.indexOf(' ')
                boundOnChange(makeValue(value + ' .'))
                break
              }

              default: {
                break
              }
            }
          }

          // Pass to native keydown
          if (typeof onKeyDown === 'function') {
            onKeyDown(evt)
          }
        }}
      />
    </div>
  )
}

export default TextField

function Icon() {
  return (
    <div className={style.left}>
      <div className={style.circle} />
    </div>
  )
}

function makeValue(value: string): { target: { value: string } } {
  return { target: { value: value } }
}
