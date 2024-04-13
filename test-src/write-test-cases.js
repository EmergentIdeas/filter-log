
var filog = require('../filter-log')
var expect = require('chai').expect
var assert = require('chai').assert
var stringStream = require('../streams/string-stream')

function add() {
	filog.baseInformationGenerator = function () {
		return {}
	}
	var log1 = filog('standard')

	describe("does writing work", function () {
		it("a simple write", function () {
			filog.clearProcessors()
			var out = stringStream()
			filog.defineProcessor('string-out', null, out)

			log1.write({ msg: 'hello' })
			assert.equal('{"loggerName":"standard","msg":"hello"}\n', out.data)
		})

		it("a debug write", function () {
			filog.clearProcessors()
			var out = stringStream()
			filog.defineProcessor('string-out', null, out)

			log1.debug({ msg: 'hello' })
			assert.equal('{"loggerName":"standard","msg":"hello","level":10}\n', out.data)
		})

		it("an info write", function () {
			filog.clearProcessors()
			var out = stringStream()
			filog.defineProcessor('string-out', null, out)

			log1.info({ msg: 'hello' })
			assert.equal('{"loggerName":"standard","msg":"hello","level":20}\n', out.data)
		})

		it("a debug string write", function () {
			filog.clearProcessors()
			var out = stringStream()
			filog.defineProcessor('string-out', null, out)

			log1.debug("hello there")
			assert.equal('{"loggerName":"standard","msg":"hello there","level":10}\n', out.data)
		})

		it("a debug formatted string write", function () {
			filog.clearProcessors()
			var out = stringStream()
			filog.defineProcessor('string-out', null, out)

			log1.debug("hello there %d", 56)
			assert.equal('{"loggerName":"standard","msg":"hello there %d","args":[56],"level":10}\n', out.data)
		})


	})


}

module.exports = add