var through2 = require('through2')

var createStream = function(filter) {
	
	var stream = through2({ objectMode: true }, function(chunk, enc, callback) {
		if(filter(chunk)) {
			this.push(chunk)
		}
	    callback()
	})
	return stream
}

module.exports = createStream