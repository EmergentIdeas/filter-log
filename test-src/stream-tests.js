const mocha = require('mocha')
mocha.setup('bdd')
mocha.run()
var filog = require('../filter-log-browser')

let add = require('./default-data-test-cases')
add(filog)

add = require('./object-test-cases')
add(filog)

add = require('./write-test-cases')
add(filog)