'use strict'

module.exports = class Rule {
  constructor(opts) {
    opts = Object.assign({
      options: {}
    , defaults: {}
    , meta: {}
    }, opts)

    if (!opts.id) {
      throw new Error('Rule must have an id')
    }

    if (typeof opts.validate !== 'function') {
      throw new TypeError('Rule must have validate function')
    }

    this.id = opts.id
    this.enabled = opts.enabled !== false
    this.meta = opts.meta
    this.defaults = opts.defaults
    this.options = opts.options
    this._validate = opts.validate
  }

  validate(commit) {
    console.log('validate', this)
    this._validate(commit, this)
  }
}
