'use strict'

const id = 'title-length'

module.exports = {
  id: id
, meta: {
    description: 'enforce max length of commit title'
  , recommended: true
  }
, defaults: {
    length: 50
  }
, options: {
    length: 50
  }
, validate: (context, rule) => {
    const len = rule.options.length || rule.defaults.length
    if (context.title.length > len) {
      context.report({
        id: id
      , message: `Commit title should be < ${len} columns`
      , line: context.title
      , maxLength: len
      })

      return false
    }

    return true
  }
}
