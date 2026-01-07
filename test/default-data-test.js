require('mocha')
var filog = require('../filter-log')
filog.sync = true

let add = require('../test-src/default-data-test-cases')

add(filog)