var through2 = require('through2')
var stream = require('stream');

var createStream = function() {
	return new stream.Transform({objectMode: true})
}

module.exports = createStream