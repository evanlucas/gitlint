'use strict'

const test = require('tap').test
const Linter = require('../')

test('Linter', (t) => {
  const linter = new Linter({
    rules: {
      'title-length': { length: 40 }
    }
  })

  const input = `commit e7c077c610afa371430180fbd447bfef60ebc5ea
Author: Calvin Metcalf <cmetcalf@appgeo.com>
Date:   Tue Apr 12 15:42:23 2016 -0400

    stream: make null an invalid chunk to write in object mode

    this harmonizes behavior between readable, writable, and transform
    streams so that they all handle nulls in object mode the same way by
    considering them invalid chunks.

    PR-URL: https://github.com/nodejs/node/pull/6170
    Reviewed-By: James M Snell <jasnell@gmail.com>
    Reviewed-By: Matteo Collina <matteo.collina@gmail.com>`

  linter.lint(input)
  t.equal(linter.messages.length, 1, 'messages.length')
  const m = linter.messages[0]
  t.equal(m.data.id, 'title-length', 'data.id')
  t.equal(m.data.maxLength, 40, 'data.maxLength')
  t.equal(m.commit.sha, 'e7c077c610afa371430180fbd447bfef60ebc5ea', 'sha')
  t.end()
})
