const Transform = require('../streams/transform')

var createStream = function (filter) {

	let stream = new Transform({
		objectMode: true,

		transform(chunk, encoding, callback) {
			// this.push(chunk)
			callback()
		}
	})

	return stream
}

module.exports = createStream