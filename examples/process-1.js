#!/usr/local/bin/node
var JSONStream = require('JSONStream')
var through2 = require('through2')
var levels = require('../levels')

/**
Shows all messages at a log level of error or greater. They are logged numerically
and defined in levels.js

Invoke like:

cat my-log.json | ./process-1.js > my-log.txt

*/

var parserPipe = JSONStream.parse(true)
process.stdin
	.pipe(parserPipe)
	.pipe(through2({objectMode: true}, function(entry, enc, callback) {
		if(entry.level && entry.level >= levels.ERROR) {}
			process.stdout.write(entry.date + ' - ' + entry.msg)
			process.stdout.write('\n')
		}
		callback()
	})
)