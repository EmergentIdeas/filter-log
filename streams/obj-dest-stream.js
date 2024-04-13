const Transform = require('./transform')

var createStream = function (filter) {

	let stream = new Transform({
		objectMode: true,

		transform(chunk, encoding, callback) {
			this.data.push(chunk)
			callback()
		}
	})
	stream.data = []

	return stream
}

module.exports = createStream
