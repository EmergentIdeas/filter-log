var through2 = require('through2')


var transformer = function(prefix) {
	return through2({ objectMode: true }, function(chunk, enc, callback) {
	    var result = JSON.stringify(chunk)
		if(prefix) {
			this.push(prefix)
		}
	    this.push(result)
	    callback()
	})
}

module.exports = transformer