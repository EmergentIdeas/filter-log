const { Transform } = require('stream')

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
	let stream = new Transform({
		objectMode: true,

		transform(chunk, encoding, callback) {
			var result = JSON.stringify(chunk, errorSerialization)
			if (prefix) {
				this.push(prefix)
			}
			this.push(result)
			if (suffix) {
				this.push(suffix)
			}
			callback()
		}
	})
	return stream
}

module.exports = transformer