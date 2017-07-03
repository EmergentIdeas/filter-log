var through2 = require('through2')

var createStream = function(transform) {
	
	var stream = through2({ objectMode: true }, function(chunk, enc, callback) {
		this.push(transform(chunk))
	    callback()
	})
	return stream
}

module.exports = createStream