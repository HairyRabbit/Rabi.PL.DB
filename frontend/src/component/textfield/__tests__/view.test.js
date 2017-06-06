// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-

import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import renderer from 'react-test-renderer'
import { shallow, mount, render } from 'enzyme'
import TextField from '../'
import {
  initModel,
  initAutoComplete,
  update,
  change,
  turn,
  toggle
} from '../state'

describe('test TextField', () => {
  const store = createStore(update, {
    value: '',
    autocomplete: {
      list: ['foo', 'bar', 'baz'],
      display: []
    }
  })
  const mapStateToProps = state => ({
    value: state.value,
    autocomplete: state.autocomplete
  })
  const mapDispatchToProps = dispatch => ({
    boundChange: type => value => dispatch(change(value, type))
  })
  const ConnectTextField = connect(mapStateToProps, mapDispatchToProps)(
    TextField
  )
  let component

  it('should init component.', () => {
    component = renderer.create(
      <Provider store={store}>
        <ConnectTextField />
      </Provider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should change value on dispatched.', () => {
    store.dispatch(change('foo', 'text'))
    component = renderer.create(
      <Provider store={store}>
        <ConnectTextField />
      </Provider>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should clean value.', () => {
    component = renderer.create(
      <Provider store={store}>
        <ConnectTextField />
      </Provider>
    )
    component.toJSON().children[1].props.onKeyDown({
      preventDefault: jest.fn(),
      ctrlKey: true,
      which: 76
    })
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should tap tab key autocomplate matched value.', () => {
    store.dispatch(change('b'))
    component = renderer.create(
      <Provider store={store}>
        <ConnectTextField autocompleteValueDecode={x => x.value} />
      </Provider>
    )
    component.toJSON().children[1].props.onKeyDown({
      preventDefault: jest.fn(),
      which: 9
    })
    expect(component.toJSON()).toMatchSnapshot()
  })
})
