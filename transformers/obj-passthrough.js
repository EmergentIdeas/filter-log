var through2 = require('through2')


var transformer = function() {
	return through2({ objectMode: true }, function(chunk, enc, callback) {
	    this.push(chunk)
	    callback()
	})
}

module.exports = transformer