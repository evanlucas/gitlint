#!/usr/bin/env node

'use strict'

const help = require('help')()
const nopt = require('nopt')
const path = require('path')
const exec = require('child_process').exec

const knownOpts = { help: Boolean
                  , version: Boolean
                  , config: path
                  , json: Boolean
                  , silent: Boolean
                  }

const shortHand = { h: ['--help']
                  , v: ['--version']
                  , c: ['--config']
                  , j: ['--json']
                  , s: ['--silent']
                  }

const argv = nopt(knownOpts, shortHand)

if (argv.help) {
  return help()
}

if (argv.version) {
  console.log('gitlint', `v${require('../package').version}`)
  return
}

const shas = argv.argv.remain
if (!shas.length) {
  return help(1)
}

function getCommitCommand(sha) {
  return `git show --quiet ${sha}`
}

let config
if (argv.config) {
  config = require(argv.config)
}

const opts = Object.assign({}, config || {})

const Linter = require('../')
const linter = new Linter(opts)
;(function run() {
  if (!shas.length) return done()
  const sha = shas.shift()
  exec(getCommitCommand(sha), (err, stdout, stderr) => {
    if (err) throw err
    linter.lint(stdout)
    run()
  })
})()

function done() {
  if (linter.messages.length) {
    process.exitCode = 1
  } else {
    process.exitCode = 0
  }

  if (argv.silent) return
  if (argv.json) return json()
  return pretty()
}

function json() {
  console.error(linter.messages.map((item) => {
    const commit = item.commit
    const data = item.data

    data.sha = commit.sha
    return data
  }))
}

function pretty() {
  linter.messages.forEach((item) => {
    console.error('  ', item.commit.sha)
    console.error('    %s: %s', item.data.id, item.data.message)
    console.error()
  })
}
