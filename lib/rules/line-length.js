'use strict'

const id = 'line-length'

module.exports = {
  id: id
, meta: {
    description: 'enforce max length of lines in commit body'
  , recommended: true
  }
, defaults: {
    length: 72
  }
, options: {
    length: 72
  }
, validate: (context, rule) => {
    const len = rule.options.length || rule.defaults.length
    const body = context.body
    let isValid = true
    for (let i = 0; i < body.length; i++) {
      const line = body[i]
      if (line.length > len) {
        if (isValid) isValid = false
        context.report({
          id: id
        , message: `Line should be < ${len} columns.`
        , line: line
        , maxLength: len
        })
      }
    }

    return isValid
  }
}
