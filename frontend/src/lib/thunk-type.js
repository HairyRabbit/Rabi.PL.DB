// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * thunk-type
 *
 * Thunk action types.
 */

export type Dispatch<T> = (action: T | ThunkAction<T>) => any
export type GetState = () => Object
export type ThunkAction<T> = (dispatch: Dispatch<T>, getState: GetState) => any
