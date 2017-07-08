// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * pick-post-mate
 *
 * Pick and earse post mate date, used for generate post style.
 */

type PostMate = {
  title: string,
  author: string,
  date: number,
  keywords: Array<string>,
  subtitle: string,
  description: string
}

function pickPostMate(raw: string): PostMate {
  return raw
    .slice(3, -3)
    .replace(/\\\n/g, '')
    .split(/\n/)
    .filter(Boolean)
    .map(x => x.split(/:\s/))
    .reduce((acc, curr) => {
      acc[curr[0].toLowerCase()] = curr[1]
      return acc
    }, {})
}

export default pickPostMate
