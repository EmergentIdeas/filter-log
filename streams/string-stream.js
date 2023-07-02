const { Transform } = require('stream')

var createStream = function () {

	let stream = new Transform({
		objectMode: false,

		transform(chunk, encoding, callback) {
			var result = chunk.toString()
			this.data += result
			this.push(result)
			callback()
		}
	})
	stream.data = ''

	return stream
}

module.exports = createStream