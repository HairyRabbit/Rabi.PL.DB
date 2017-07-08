// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * mapto-password-strength
 *
 * Compute password strength.
 *
 * 1. TODO Length Source 
 *
 * | password length   | source |
 * |-------------------|--------|
 * | less then 8       | 0      |
 * | between 8 and 10  | 10     |
 * | between 10 and 12 | 20     |
 * | between 12 and 15 | 30     |
 * | greater than 15   | 40     |
 *
 * 2. Number Source
 *
 * | number of occurrence  | source |
 * |-----------------------|--------|
 * | none                  | 0      |
 * | more then one         | 10     |
 * | not begin with number | 20     |
 *
 * 3. Chars Source
 *
 * | chars of occurrence           | source |
 * |-------------------------------|--------|
 * | none                          | 0      |
 * | more then one                 | 10     |
 * | mixed lowercase and uppercase | 20     |
 *
 * 4. Symbol
 *
 * | symbols of occurrence       | source |
 * |-----------------------------|--------|
 * | none                        | 0      |
 * | one of !@#$%^&*._           | 10     |
 * | more then one and different | 20     |
 *
 * Summary
 *
 * | rating | source   |
 * |--------|----------|
 * | week   | 40       |
 * | medium | 40 - 60  |
 * | strong | 60 - 90  |
 * | super  | 90 - 100 |
 */

import uniq from 'lodash/uniq'

export const PasswordMinLength = 8
export const PasswordMaxLength = 32
export const allowSymbols = '!@#$%^&*._'

function computeLengthSource(value: string): number {
  const len: number = value.length

  if (len > 8 && len <= 10) {
    return 10
  } else if (len > 10 && len <= 12) {
    return 20
  } else if (len > 12 && len <= 15) {
    return 30
  } else if (len > 15) {
    return 40
  } else {
    return 0
  }
}

function computeNumberSource(value: string): number {
  const hasNumber: boolean = /\d+/.test(value)
  const beginWithNumber: boolean = /^\d/.test(value)

  if (hasNumber && !beginWithNumber) {
    return 20
  } else if (hasNumber) {
    return 10
  } else {
    return 0
  }
}

function computeCharSource(value: string): number {
  const hasUpperChar: boolean = /[A-Z]+/.test(value)
  const hasLowerChar: boolean = /[a-z]+/.test(value)

  if (hasUpperChar && hasLowerChar) {
    return 20
  } else if (hasUpperChar || hasLowerChar) {
    return 10
  } else {
    return 0
  }
}

function computeSymbolSource(value: string): number {
  const symbols: string = allowSymbols.split('').map(x => '\\' + x).join('|')
  const symbols_regex: RegExp = new RegExp(`[${symbols}]`, 'g')
  const matchSymbol: Array<string> = value.match(symbols_regex) || []
  switch (uniq(matchSymbol.length)) {
    case 0:
      return 0
    case 1:
      return 10
    default:
      return 20
  }
}

export type PasswordStrength = 1 | 2 | 3 | 4

export default function mapToPasswordStrength(value: string): PasswordStrength {
  const sum: number =
    computeLengthSource(value) +
    computeNumberSource(value) +
    computeCharSource(value) +
    computeSymbolSource(value)

  if (sum <= 40) {
    return 1
  } else if (sum <= 60) {
    return 2
  } else if (sum <= 90) {
    return 3
  } else {
    return 4
  }
}
