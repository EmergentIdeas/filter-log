var filog = require('../filter-log')
var stringStream = require('../streams/string-stream')
var objStream = require('../streams/obj-dest-stream')
var through2 = require('through2')
require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert

filog.baseInformationGenerator = function() {
	return {}
}
var log1 = filog('standard')

describe("tests for modifying and object destinations", function() {
	it("test obj destination stream", function() {
		filog.clearProcessors()
		var out = objStream()
		filog.defineProcessor('string-out', null, out)
		
		log1.write({msg: 'hello'})
		assert.equal('hello', out.data[0].msg)
	})
	
	it("object mode transformer", function() {
		filog.clearProcessors()
		var out = objStream()
		filog.defineProcessor('string-out', null, out, null, function(entry) {
			entry.transformInfo = 'there'
			return entry
		})
		
		log1.write({msg: 'hello'})
		assert.equal('there', out.data[0].transformInfo)
	})
	
	it("object mode transformer as stream", function() {
		filog.clearProcessors()
		var out = objStream()
		filog.defineProcessor('string-out', null, out, null, through2({ objectMode: true }, function(chunk, enc, callback) {
			chunk.transformInfo = 'you'
			this.push(chunk)
		}))
		
		
		log1.write({msg: 'hello'})
		assert.equal('you', out.data[0].transformInfo)
	})
	
	it("object mode transformer with removing filter", function() {
		filog.clearProcessors()
		var out = objStream()
		filog.defineProcessor('string-out', null, out, function(entry) { return false }, function(entry) {
			entry.transformInfo = 'there'
			return entry
		})
		
		log1.write({msg: 'hello'})
		assert.equal(0, out.data.length)
	})

	
})