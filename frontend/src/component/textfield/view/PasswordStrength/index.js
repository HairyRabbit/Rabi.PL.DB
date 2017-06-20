// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import type { PasswordStrength } from 'lib/mapto-password-strength'
import style from './style.css'

type Prop = {
  strength: PasswordStrength
}

export default function PassStrength(props: Props): React.Element<*> {
  const { strength } = props

  return (
    <div className={style.container}>
      {mapStrengthToComponent(strength)}
    </div>
  )
}

function mapStrengthToComponent(strength: PasswordStrength): React.Element<*> {
  switch (strength) {
    case 1:
      return <WeekLevel />
    case 2:
      return <MediumLevel />
    case 3:
      return <StrongLevel />
    case 4:
      return <SuperLevel />
  }
}

function WeekLevel(): React.Element<*> {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="9.6" style={{ fill: '#94d9bb' }}>
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.5s"
          values="9.6;7.6;9.6"
          fill="freeze"
        />
      </circle>
    </svg>
  )
}

function MediumLevel(): React.Element<*> {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="9.6" style={{ fill: '#94d9bb' }}>
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.2s"
          values="9.6;7.6;9.6"
          fill="freeze"
        />
      </circle>
      <circle cx="16" cy="16" r="6" style={{ fill: '#58c1be' }}>
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.2s"
          values="6;7.6;6"
          fill="freeze"
        />
      </circle>
    </svg>
  )
}

function StrongLevel(): React.Element<*> {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <path
        d="M9.212,9.212c-1.801,1.8 -2.812,4.242 -2.812,6.788c0,5.298 4.302,9.6 9.6,9.6c5.298,0 9.6,-4.302 9.6,-9.6c0,-0.844 -0.111,-1.684 -0.331,-2.499l-1.244,0.336c0.19,0.705 0.287,1.432 0.287,2.163c0,4.587 -3.725,8.312 -8.312,8.312c-4.587,0 -8.312,-3.725 -8.312,-8.312c0,-2.204 0.876,-4.318 2.435,-5.877l-0.911,-0.911Z"
        style={{ fill: '#94d9bb' }}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.8s"
          values="0,16,16;360,16,16"
          fill="freeze"
        />
      </path>
      <path
        d="M21.582,19.818c0.772,-1.12 1.185,-2.448 1.185,-3.809c0,-3.703 -3.006,-6.709 -6.709,-6.709c-3.703,0 -6.709,3.006 -6.709,6.709c0,0.79 0.139,1.573 0.411,2.313l0.806,-0.295c-0.237,-0.647 -0.359,-1.329 -0.359,-2.018c0,-3.229 2.622,-5.851 5.851,-5.851c3.229,0 5.851,2.622 5.851,5.851c0,1.187 -0.361,2.345 -1.034,3.322l0.707,0.487Z"
        style={{ fill: '#58c1be' }}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0,16,16;360,16,16"
          fill="freeze"
        />
      </path>
      <path
        d="M18.136,13.864c-0.567,-0.566 -1.335,-0.885 -2.136,-0.885c-1.667,0 -3.021,1.354 -3.021,3.021c0,1.667 1.354,3.021 3.021,3.021c1.245,0 2.363,-0.764 2.815,-1.924l-0.704,-0.274c-0.339,0.87 -1.177,1.442 -2.111,1.442c-1.25,0 -2.265,-1.015 -2.265,-2.265c0,-1.25 1.015,-2.265 2.265,-2.265c0.601,0 1.177,0.238 1.602,0.663l0.534,-0.534Z"
        style={{ fill: '#227889' }}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.2s"
          values="0,16,16;360,16,16"
          fill="freeze"
        />
      </path>
    </svg>
  )
}

function SuperLevel(): React.Element<*> {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <path
        d="M9.212,9.212c-1.801,1.8 -2.812,4.242 -2.812,6.788c0,5.298 4.302,9.6 9.6,9.6c5.298,0 9.6,-4.302 9.6,-9.6c0,-0.844 -0.111,-1.684 -0.331,-2.499l-1.244,0.336c0.19,0.705 0.287,1.432 0.287,2.163c0,4.587 -3.725,8.312 -8.312,8.312c-4.587,0 -8.312,-3.725 -8.312,-8.312c0,-2.204 0.876,-4.318 2.435,-5.877l-0.911,-0.911Z"
        style={{ fill: '#94d9bb' }}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.2s"
          values="0,16,16;360,16,16"
          fill="freeze"
        />
      </path>
      <circle cx="16.058" cy="16.009" r="6.709" style={{ fill: '#58c1be' }}>
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.2s"
          values="6.709;5.5;6.709"
          fill="freeze"
        />
      </circle>
      <circle cx="16" cy="16" r="2.626" style={{ fill: '#227889' }} />
    </svg>
  )
}
