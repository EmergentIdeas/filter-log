
var filog = require('../filter-log')
var expect = require('chai').expect
var assert = require('chai').assert

function add() {
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
			var log1 = filog({loggerName: 'log1'})
			assert.equal('log1', log1._name)
		})
	})

}

module.exports = add