'use strict'

module.exports = class Config {
  constructor(defs) {
    this._map = new Map()
    this._defaults = defs || new Map()
  }

  get(key) {
    if (this._map.has(key)) {
      return this._map.get(key)
    }

    return this._defaults.get(key)
  }

  set(key, val) {
    this._map.set(key, val)
  }

  toJSON() {
    const out = {}
    for (const item of this._map) {
      out[item[0]] = item[1]
    }

    return out
  }

  load(opts) {
    if (!opts || typeof opts !== 'object')
      return

    const keys = Object.keys(opts)
    for (let i = 0; i < keys.length; i++) {
      this._map.set(keys[i], opts[keys[i]])
    }
  }
}
