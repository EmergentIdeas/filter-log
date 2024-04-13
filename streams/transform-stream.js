const Transform = require('./transform')

var createStream = function (transform) {

	let stream = new Transform({
		objectMode: true,

		transform(chunk, encoding, callback) {
			this.push(transform(chunk))
			callback()
		}
	})

	return stream
}

module.exports = createStream

