
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./vemanager-sdk.cjs.production.min.js')
} else {
  module.exports = require('./vemanager-sdk.cjs.development.js')
}
