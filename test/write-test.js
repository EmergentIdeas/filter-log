var filog = require('../filter-log')
var stringStream = require('../streams/string-stream')
require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert

filog.baseInformationGenerator = function() {
	return {}
}
var log1 = filog('standard')

describe("does writing work", function() {
	it("a simple write", function() {
		filog.clearProcessors()
		var out = stringStream()
		filog.defineProcessor('string-out', null, out)
		
		log1.write({msg: 'hello'})
		assert.equal('{"name":"standard","msg":"hello"},', out.data)
	})
	
	it("a debug write", function() {
		filog.clearProcessors()
		var out = stringStream()
		filog.defineProcessor('string-out', null, out)
		
		log1.debug({msg: 'hello'})
		assert.equal('{"name":"standard","msg":"hello","level":10},', out.data)
	})
	
	it("an info write", function() {
		filog.clearProcessors()
		var out = stringStream()
		filog.defineProcessor('string-out', null, out)
		
		log1.info({msg: 'hello'})
		assert.equal('{"name":"standard","msg":"hello","level":20},', out.data)
	})
	
	it("a debug string write", function() {
		filog.clearProcessors()
		var out = stringStream()
		filog.defineProcessor('string-out', null, out)
		
		log1.debug("hello there")
		assert.equal('{"name":"standard","msg":"hello there","level":10},', out.data)
	})	
	
	it("a debug formatted string write", function() {
		filog.clearProcessors()
		var out = stringStream()
		filog.defineProcessor('string-out', null, out)
		
		log1.debug("hello there %d", 56)
		assert.equal('{"name":"standard","msg":"hello there 56","level":10},', out.data)
	})	

	
})