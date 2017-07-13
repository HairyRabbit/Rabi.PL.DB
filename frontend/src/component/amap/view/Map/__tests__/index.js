// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-

import React from 'react'
import { shadow } from 'enzyme'
import renderer from 'react-test-renderer'
import Map from '../'

describe('<Map /> snapshots', () => {
  const component = renderer.create(<Map />)

  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

describe('<Map /> props', () => {})
