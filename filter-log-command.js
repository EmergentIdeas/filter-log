#!/usr/local/bin/node

var JSONStream = require('JSONStream')
var through2 = require('through2')
var argv = require('minimist')(process.argv.slice(2));
var tri = require('tripartite')
var fs = require('fs')


if(argv.h || argv.help || process.stdin.isTTY) {
	fs.createReadStream('./docs/command-line-help.txt').pipe(process.stdout)
	return
}

var parserPipe = JSONStream.parse(true)
process.stdin
	.pipe(parserPipe)
	.pipe(through2({objectMode: true}, function(chunk, enc, callback) {
		
		if(argv.f) {
			with(chunk) {
				process.stdout.write(eval(argv.f))
				process.stdout.write('\n')
				callback()
			}
		}
		else if(argv.tri) {
			tt(chunk, process.stdout, function() {
				process.stdout.write('\n')
				callback()
			})
		}
		else {
			with(chunk) {
				process.stdout.write(eval('date + " - " + msg'))
				process.stdout.write('\n')
				callback()
			}
		}
		
		
	})
	
)