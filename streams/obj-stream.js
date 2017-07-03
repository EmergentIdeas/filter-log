var through2 = require('through2')

var createStream = function() {
	
	var stream = through2({ objectMode: true }, function(chunk, enc, callback) {
	    var result = chunk.toString()
		this.data.push(result)
	    this.push(result)
	    callback()
	})
	
	stream.data = []
	
	return stream
}

module.exports = createStream