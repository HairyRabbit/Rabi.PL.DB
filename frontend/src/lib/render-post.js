// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * render-post
 *
 * Render post to React Component.
 */

import { toHTMLTree } from 'markdown'
import { createElement } from 'React'
import pickPostMate from './pick-post-mate'

type Post = {
  mate: Mate,
  content: any
}

function pickMateData(str: string): Post {
  let mate
  const content: string = raw.replace(/^---([^]+)---/, function(f, a) {
    if (!a) {
      throw new Error(`Parse mate data failed.`)
    }
    mate = pickPostMate(a)
    return ''
  })

  return {
    mate,
    content
  }
}

function renderContent(str: string): React.Element<*> {
  const { mate, content } = pickMateData(str)
  let out

  function walk(tree) {
    if (Array.isArray(tree)) {
      if (Array.isArray(tree[1])) {
        return createElement(tree[0], null, tree.map(walk))
      } else {
        return createElement(tree[0], null, tree[1])
      }
    }
  }

  return <div>{toHTMLTree(content).map(walk)}</div>
}

export default render
