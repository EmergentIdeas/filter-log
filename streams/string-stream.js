var through2 = require('through2')

var createStream = function() {
	
	var stream = through2({ objectMode: false }, function(chunk, enc, callback) {
	    var result = chunk.toString()
		this.data += result
	    this.push(result)
	    callback()
	})
	
	stream.data = ''
	
	return stream
}

module.exports = createStream