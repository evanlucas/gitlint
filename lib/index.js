'use strict'

const fs = require('fs')
const path = require('path')
const EE = require('events')
const BaseParser = require('gitlint-parser-base')
const Config = require('./config')
const BaseRule = require('./rule')

module.exports = class Gitlint extends EE {
  constructor(opts) {
    super()

    const o = Object.assign({
      parser: 'gitlint-parser-base'
    , ignores: []
    }, opts)

    this.messages = []
    this.parser = require(o.parser)

    this.config = new Config()
    this.rules = new Map()

    this.loadBaseRules()

    if (o.rules) {
      this.loadRules(o.rules)
    }

    if (o.ignores.length) {
      o.ignores.forEach((item) => {
        if (this.rules.has(item)) {
          this.disableRule(item)
        }
      })
    }
  }

  loadRulesFromDir(dir) {
    fs.readdirSync(dir).forEach((item) => {
      if (path.extname(item) === '.js') {
        const ruleConfig = require(path.join(dir, item))
        this.rules.set(ruleConfig.id, ruleConfig)
      }
    })
  }

  loadBaseRules() {
    const dir = path.join(__dirname, 'rules')
    this.loadRulesFromDir(dir)
  }

  loadCustomRule(config) {
    if (!config || typeof config !== 'object') {
      throw new TypeError('rule must be an object')
    }

    const rule = new BaseRule(config)
    this.rules.set(rule.id, rule)
  }

  enableRule(id) {
    if (!this.rules.has(id)) {
      throw new Error(`Invalid rule: ${id}`)
    }

    this.rules.get(id).disabled = false
  }

  disableRule(id) {
    if (!this.rules.has(id)) {
      throw new Error(`Invalid rule: ${id}`)
    }

    this.rules.get(id).disabled = true
  }

  loadRules(rules) {
    if (!rules || typeof rules !== 'object') {
      throw new TypeError('rules must be an object')
    }

    const keys = Object.keys(rules)
    for (const id of keys) {
      const val = rules[id]
      if (this.rules.has(id)) {
        this.rules.get(id).options = val
      } else {
        const err = new Error(`Invalid rule: ${id}`)
        err.code = 'ENOTFOUND'
        this.emit('error', err)
      }
    }
  }

  lint(str) {
    if (Array.isArray(str)) {
      sha.forEach((item) => {
        this.lint(item)
      })
    } else {
      const commit = new this.parser(str, this)
      for (const rule of this.rules.values()) {
        if (rule.disabled) continue
        rule.validate(commit, rule)
      }
    }
  }

  report(opts) {
    this.messages.push(opts)
  }
}
