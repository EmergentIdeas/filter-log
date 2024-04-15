const mocha = require('mocha')
mocha.setup('bdd')
mocha.run()
var expect = require('chai').expect
var assert = require('chai').assert
var filog = require('../filter-log-browser')

describe("basic tests that the default data initialization works", function () {
	it("no name", function () {
		var log1 = filog()
		assert.equal('standard', log1._name)
	})

	it("string as name", function () {
		var log1 = filog('log1')
		assert.equal('log1', log1._name)
	})

	it("passed initialization name", function () {
		var log1 = filog({ loggerName: 'log1' })
		assert.equal('log1', log1._name)
	})
})

filog.baseInformationGenerator = function () {
	return {}
}
var log1 = filog('standard')

function objStream() {
	let f = function (data) {
		f.data.push(data)
	}
	f.data = []
	return f
}

function stringStream() {
	let f = function (data) {
		if (typeof data !== 'string') {
			data = JSON.stringify(data) + '\n'
		}
		f.data += data
	}
	f.data = ''
	return f
}

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

		let stream = {
			objectMode: true,

			transform(chunk, encoding, callback) {
				chunk.transformInfo = 'you'
				this.push(chunk)
			}
		}

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
		assert(JSON.stringify(out.data[0].error).indexOf('Error: This is a test') > -1)
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
filog.baseInformationGenerator = function () {
	return {}
}
log1 = filog('standard')

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