const { Transform } = require('stream')

var createStream = function () {

	let stream = new Transform({
		objectMode: true,

		transform(chunk, encoding, callback) {
			this.push(chunk)
			callback()
		}
	})

	return stream
}

module.exports = createStream