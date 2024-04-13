const Transform = require('./transform')

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