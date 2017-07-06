var through2 = require('through2')

var createStream = function() {
	
	var stream = through2({ objectMode: true }, function(chunk, enc, callback) {
		this.data.push(chunk)
	    callback()
	})
	
	stream.data = []
	
	return stream
}

module.exports = createStream