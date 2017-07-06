#!/usr/local/bin/node
var filog = require('../filter-log')
filog.defineProcessor('standard', {}, process.stdout)
var log = filog()
var rs = require('random-strings')

var count = 10000

var randomEntry = function() {
	log.info('hello, %s!', rs.alphaUpper(1) + rs.alphaLower(9))	
	if(count-- > 0) {
		setTimeout(randomEntry, parseInt(Math.random() * 10))
	}
}

randomEntry()