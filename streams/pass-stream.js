var through2 = require('through2')
// var stream = require('stream');

// var createStream = function() {
// 	return new stream.Transform({objectMode: true})
// }
// 
// module.exports = createStream


var createStream = function() {
	
	var stream = through2({ objectMode: true }, function(chunk, enc, callback) {
	    this.push(chunk)
	    callback()
	})
	
	return stream
}

module.exports = createStream