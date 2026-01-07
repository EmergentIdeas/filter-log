require('mocha')

var filog = require('../filter-log')
filog.sync = true
let add = require('../test-src/write-test-cases')
add(filog)