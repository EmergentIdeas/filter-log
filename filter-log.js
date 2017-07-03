var _ = require('underscore')

var util = require('util')
var isStream = require('is-stream')

var createStringifier = require('./transformers/obj-to-json-string')
var createPass = require('./streams/pass-stream')
var createFilterStream = require('./streams/filter-stream')
var createTransformerStream = require('./streams/transform-stream')

var logsData = {}
var logsProc = {}

function writeToProcessors(data) {
	_.each(_.values(logsProc), function(processor) {
		processor.head.write(data)
	})
}

function makeLogger(name, stream) {
	stream._name = name
	
	stream._transform = function(data, enc, callback) {
		writeToProcessors(_.extend(filterLog.baseInformationGenerator(), logsData[name], stream.loggerSpecificData, data))
		callback()
	}
	
	_.each(_.keys(filterLog.levels), function(key) {
		stream[key.toLowerCase()] = function(data) {
			if(typeof data == 'string') {
				data = {
					msg: util.format.apply(this, arguments)
				}
			}
			if(typeof data == 'object') {
				stream.write(_.extend({}, data, {level: filterLog.levels[key]}))
			}
		}
	})
	return stream
}


var filterLog = function() {
	var args = []
	
	for(var i = 0; i < arguments.length; i++) {
		args.push(arguments[i])
	}
	
	
	var initData = {}
	var loggerName = filterLog.defaultData.name
	var hasSpecificData = false
	
	// Look at the first two arguments. This is either a name and base information
	// object or just a base information object (probably with a name, but not always)
	// or neither of these things, where let's assume they're tring to define the
	// standard logger
	if(args.length > 0) {
		var first = args.shift()
		
		if(typeof first == 'string') {
			loggerName = first
			
			if(args.length > 0 && typeof args[0] == 'object' && !isStream(args[0])) {
				initData = args.shift()
				loggerName = initData.name || loggerName
				hasSpecificData = true
			}
		}
		else if(typeof first == 'object' && !isStream(first)) {
			loggerName = first.name || loggerName
			initData = first
			hasSpecificData = true
		}
		else if(isStream(first)) {
			// No information about what to call it or what data to use, but first
			// argument is a stream, so let's return it to the list
			args.unshift(first)
		}
	}
	
	initData.name = loggerName
	
	var logger = makeLogger(loggerName, createPass())
	if(hasSpecificData) {
		// They have some logger specifc data they want to use
		logger.loggerSpecificData = initData
	}
	
	if(!logsData[loggerName]) {
		// this logger doesn't exists. That's the only way we'll pay attention
		// to a data definition
		initData = _.extend({}, filterLog.defaultData, initData)
		logsData[loggerName] = initData
	}
	
	return logger
}

filterLog.defineProcessor = function(/* string */ name, /* object */ baseData, 
	/* stream */ destination, /* function */ filter, /* stream */ transformer) {
	var procData = {
		name: name,
		destination: destination || process.stdout,
		baseData: _.extend({}, baseData, { processorName: name }),
		
		// should be a function or stream of some sort
		filter: filter || function(item) { return true }
	}
	
	// should be a function or stream of some sort
	procData.transformer = transformer || 
		(procData.destination._writableState.objectMode == true ? 
			createPass() : createStringifier(','))
	
	if(typeof procData.filter == 'function') {
		procData.filter = createFilterStream(procData.filter)
	}
	if(typeof procData.transformer == 'function') {
		procData.transformer = createTransformerStream(procData.transformer)
	}
	procData.head = procData.filter
	procData.head.pipe(procData.transformer).pipe(procData.destination)
	logsProc[name] = procData
}

filterLog.createStdOutProcessor = function() {
	filterLog.defineProcessor('std-out')
}

filterLog.defaultData = {
	name: 'standard'
}

filterLog.clearProcessors = function() {
	logsProc = {}
}

filterLog.baseInformationGenerator = function() {
	return {
		date: new Date()
	}
}

filterLog.levels = require('./levels')


module.exports = filterLog