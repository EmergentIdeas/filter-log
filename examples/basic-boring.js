var filog = require('../filter-log')
filog.defineProcessor('standard', {}, process.stdout)
var log = filog()
log.info('hello, world!')