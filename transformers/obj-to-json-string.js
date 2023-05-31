var through2 = require('through2')

function errorSerialization(key, obj) {
	if (obj instanceof Error) {
		return {
			name: obj.name,
			message: obj.message,
			stack: obj.stack
		}
	}
	return obj
}

var transformer = function (prefix, suffix) {
	return through2({ objectMode: true }, function (chunk, enc, callback) {
		var result = JSON.stringify(chunk, errorSerialization)
		if (prefix) {
			this.push(prefix)
		}
		this.push(result)
		if (suffix) {
			this.push(suffix)
		}
		callback()
	})
}

module.exports = transformer