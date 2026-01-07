require('mocha')
var filog = require('../filter-log')
filog.sync = true

let add = require('../test-src/object-test-cases')
add(filog)