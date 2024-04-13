
var filog = require('../filter-log')
var expect = require('chai').expect
var assert = require('chai').assert
var stringStream = require('../streams/string-stream')
var objStream = require('../streams/obj-dest-stream')
const Transform = require('../streams/transform')

function add() {
	filog.baseInformationGenerator = function () {
		return {}
	}
	var log1 = filog('standard')

	describe("tests for modifying and object destinations", function () {
		it("test obj destination stream", function () {
			filog.clearProcessors()
			var out = objStream()
			filog.defineProcessor('string-out', null, out)

			log1.write({ msg: 'hello' })
			assert.equal('hello', out.data[0].msg)
		})

		it("object mode transformer", function () {
			filog.clearProcessors()
			var out = objStream()
			filog.defineProcessor('string-out', null, out, null, function (entry) {
				entry.transformInfo = 'there'
				return entry
			})

			log1.write({ msg: 'hello' })
			assert.equal('there', out.data[0].transformInfo)
		})

		it("object mode transformer as stream", function () {
			filog.clearProcessors()
			var out = objStream()

			let stream = new Transform({
				objectMode: true,

				transform(chunk, encoding, callback) {
					chunk.transformInfo = 'you'
					this.push(chunk)
				}
			})

			filog.defineProcessor('string-out', null, out, null, stream)


			log1.write({ msg: 'hello' })
			assert.equal('you', out.data[0].transformInfo)
		})

		it("object mode transformer with removing filter", function () {
			filog.clearProcessors()
			var out = objStream()
			filog.defineProcessor('string-out', null, out, function (entry) { return false }, function (entry) {
				entry.transformInfo = 'there'
				return entry
			})

			log1.write({ msg: 'hello' })
			assert.equal(0, out.data.length)
		})

		it("test error object", function () {
			filog.clearProcessors()
			var out = objStream()
			filog.defineProcessor('string-out', null, out)

			let msg = 'This is a test'
			let e = new Error(msg)
			log1.info(e)
			assert(out.data[0].error.toString().indexOf('Error: This is a test') == 0)
		})

		it("test error object string", function () {
			filog.clearProcessors()
			var out = stringStream()
			filog.defineProcessor('string-out', null, out)

			let msg = 'This is a test'
			let e = new Error(msg)
			log1.info(e)

			// basically, we just want to ensure that we got a stack trace from our error
			assert(out.data.length > 200)
		})

	})

}

module.exports = add