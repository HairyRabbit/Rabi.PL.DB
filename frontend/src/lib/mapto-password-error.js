// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * mapto-password-error
 *
 * Check password errors.
 *
 * 1. Length Error 
 *   - too short. less then min password length
 *   - too long. greater then max password length
 *
 * 2. Number Error
 *   - no number. haven't number
 *
 * 3. Char Error
 *   - no char. haven't char
 *
 * 4. Symbol Error
 *   - special symbol. has special symbol
 */

import uniq from 'lodash/uniq'
import {
  PasswordMinLength,
  PasswordMaxLength,
  allowSymbols
} from './mapto-password-strength'

export type ErrorType =
  | { type: 'should', value: boolean }
  | { type: 'never', value: ?Array<string> | ?boolean }

export type PasswordError = {
  tooShort: ErrorType,
  noNumber: ErrorType,
  noChar: ErrorType,
  tooLong: ErrorType,
  specialChar: ErrorType
}

export const initPasswordError: PasswordError = {
  tooShort: { type: 'should', value: true },
  noNumber: { type: 'should', value: true },
  noChar: { type: 'should', value: true },
  tooLong: { type: 'never', value: null },
  specialChar: { type: 'never', value: null }
}

function constSymbolsRegexp(symbols: string): RegExp {
  const allowChars = symbols + '0-9a-zA-Z'
  return new RegExp(`[^${allowChars}]+`, 'g')
}

function updateError(
  error: PasswordError,
  key: $Keys<PasswordError>,
  value: $PropertyType<ErrorType, 'value'>
): PasswordError {
  return {
    ...error,
    [key]: {
      ...error[key],
      value: value
    }
  }
}

export default function(value: string): PasswordError {
  const len: number = value.length
  let error: PasswordError = initPasswordError

  error = updateError(error, 'tooShort', len < 8)
  error = updateError(error, 'noNumber', !/\d+/.test(value))
  error = updateError(error, 'noChar', !/[a-zA-Z]+/.test(value))

  if (len > 32) {
    error = updateError(error, 'tooLong', true)
  }

  const regex = constSymbolsRegexp(allowSymbols)
  const matched = value.match(regex)
  if (matched) {
    error = updateError(error, 'specialChar', matched.join('').split(''))
  }

  return error
}

export function mapPasswordErrorLabelToString(
  label: $Keys<PasswordError>,
  symbols?: $PropertyType<ErrorType, 'value'>
) {
  switch (label) {
    case 'tooShort':
      return 'length must greater then 8'
    case 'tooLong':
      return 'length must less then 32'
    case 'noNumber':
      return 'should has at least one number'
    case 'noChar':
      return 'should has at least one char'
    case 'specialChar':
      return `should not use ${uniq(symbols)
        .map(mapPasswordSpecialSymbolToString)
        .join(', ')}`
  }
}

export function mapPasswordSpecialSymbolToString(symbol: string): string {
  switch (symbol) {
    case ' ':
      return 'Space'
    case '\t':
      return 'Tab'
    case '\n':
      return 'Newline'
    default:
      return symbol
  }
}

export function hasError(error: PasswordError): boolean {
  return Object.values(error).map(x => Boolean(x.value)).some(Boolean)
}
