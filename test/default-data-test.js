var filog = require('../filter-log')
require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert

describe("basic tests that the default data initialization works", function() {
	it("no name", function() {
		var log1 = filog()
		assert.equal('standard', log1._name)
	})
	
	it("string as name", function() {
		var log1 = filog('log1')
		assert.equal('log1', log1._name)
	})
	
	it("passed initialization name", function() {
		var log1 = filog({name: 'log1'})
		assert.equal('log1', log1._name)
	})
})