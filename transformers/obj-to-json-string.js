var through2 = require('through2')


var transformer = function(prefix, suffix) {
	return through2({ objectMode: true }, function(chunk, enc, callback) {
	    var result = JSON.stringify(chunk)
		if(prefix) {
			this.push(prefix)
		}
	    this.push(result)
		if(suffix) {
			this.push(suffix)
		}
	    callback()
	})
}

module.exports = transformer