// let props = require('./test-properties')
const mocha = require('mocha')
mocha.setup('bdd')
mocha.run()
// const addBasicCases = require('../test-lib/basic-test-cases')
// let Sink = require('../lib/file-sink-remote-http-browser')
// addBasicCases(props, Sink)

let add = require('../test-src/default-data-test-cases')
add()

add = require('../test-src/object-test-cases')
add()

add = require('../test-src/write-test-cases')
add()