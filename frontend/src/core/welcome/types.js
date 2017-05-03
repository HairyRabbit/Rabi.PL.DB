// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow


// ssl options
export type SSL = 'disabled' | 'require' | 'verify-full'

// connect errors
export type ConnectError = {
  +code:    number,
  +message: string
}

// connect object
export type ConnectObject = {
  +host     : string,
  +port     : number,
  +user     : string,
  +pass     : string,
  +database : ?string,
  +ssl      : SSL
}



/// Msg

export const Connect        : 'Connect'        = 'Connect'
export const ConnectSuccess : 'ConnectSuccess' = 'ConnectSuccess'
export const ConnectFailure : 'ConnectFailure' = 'ConnectFailure'
export const FormValued     : 'FormValued'     = 'FormValued'

export type ConnectAction = {
  type: typeof Connect
}

export type ConnectSuccessAction = {
  type: typeof ConnectSuccess,
  payload: null
}

export type ConnectFailureAction = {
  type: typeof ConnectFailure,
  payload: ConnectError
}

export type FormValuedAction = {
  type: typeof FormValued,
  payload: null
}

export type Action
  = ConnectAction
  | ConnectSuccessAction
  | ConnectFailureAction
  | FormValuedAction


export type Dispatch<T> = (action: T | ThunkAction<T>) => any
export type GetState = () => Object
export type ThunkAction<T> = (dispatch: Dispatch<T>, getState: GetState) => any


/// Model


export type Model = {
  +connected  : boolean,
  +connecting : boolean,
  +error      : ?ConnectError,
  +connect    : ConnectObject 
}
