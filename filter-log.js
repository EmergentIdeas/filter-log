var isStream = require('is-stream')

var createStringifier = require('./transformers/obj-to-json-string')
var createPass = require('./streams/pass-stream')
var createFilterStream = require('./streams/filter-stream')
var createTransformerStream = require('./streams/transform-stream')



function writeToProcessors(data, sync) {
	Object.values(filterLog.logsProc).forEach(processor => {
		let doIt = () => {
			processor.head.write(data)
		}
		if(sync) {
			return doIt()
		}
		else {
			setTimeout(() => {
				doIt
			}, 1)
		}
	})
}

function makeLogger(name, stream) {
	stream._name = name
	
	stream._transform = function(data, enc, callback) {
		if(typeof data == 'string') {
			data = {
				msg: data
			}
		}
		writeToProcessors(Object.assign(filterLog.baseInformationGenerator(), 
		{loggerName: name}, filterLog.logsData[name], stream.loggerSpecificData, data), stream.sync)
		callback()
	}
	
	Object.keys(filterLog.levels).forEach(key => {
		stream[key.toLowerCase()] = function(data) {
			let args = [...arguments]
			let doIt = () => {
				if(typeof data == 'string') {
					data = {
						msg: data
					}
					
					args.shift()
					if(args.length > 0) {
						data.args = args
					}
				}
				if(data instanceof Error) {
					data = {
						error: {
							message: data.message
							, stack: data.stack
						}
					}
				}
				if(typeof data == 'object') {
					stream.write(Object.assign({}, data, {level: filterLog.levels[key]}))
				}
			}
			if(stream.sync) {
				return doIt()
			}
			else {
				setTimeout(doIt, 1)
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
	var loggerName = filterLog.defaultData.loggerName
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
				loggerName = initData.loggerName || loggerName
				hasSpecificData = true
			}
		}
		else if(typeof first == 'object' && !isStream(first)) {
			loggerName = first.loggerName || loggerName
			initData = first
			hasSpecificData = true
		}
		else if(isStream(first)) {
			// No information about what to call it or what data to use, but first
			// argument is a stream, so let's return it to the list
			args.unshift(first)
		}
	}
	
	initData.loggerName = loggerName
	
	var logger = makeLogger(loggerName, createPass())
	logger.sync = filterLog.sync
	if(hasSpecificData) {
		// They have some logger specifc data they want to use
		logger.loggerSpecificData = initData
	}
	
	
	
	return logger
}

if(!global['filter-log-logsData']) {
	global['filter-log-logsData'] = {}
}
filterLog.logsData = global['filter-log-logsData']

if(!global['filter-log-logsProc']) {
	global['filter-log-logsProc'] = {}
}
filterLog.logsProc = global['filter-log-logsProc']


filterLog.defineLoggerBaseData = function(loggerName, data) {
	data = Object.assign({}, data)
	delete data.loggerName
	filterLog.logsData[loggerName] = data
}

filterLog.defineProcessor = function(/* string */ name, /* object */ baseData, 
	/* stream */ destination, /* function */ filter, /* stream */ transformer) {
	var procData = {
		name: name,
		destination: destination || process.stdout,
		baseData: Object.assign({}, baseData, { processorName: name }),
		
		// should be a function or stream of some sort
		filter: filter || function(item) { return true }
	}
	
	// should be a function or stream of some sort
	procData.transformer = transformer || 
		(procData.destination._writableState.objectMode == true ? 
			createPass() : createStringifier(null, '\n'))
	
	if(typeof procData.filter == 'function') {
		procData.filter = createFilterStream(procData.filter)
	}
	if(typeof procData.transformer == 'function') {
		procData.transformer = createTransformerStream(procData.transformer)
	}
	procData.head = procData.filter
	procData.head.pipe(procData.transformer).pipe(procData.destination)
	filterLog.logsProc[name] = procData
}

filterLog.createStdOutProcessor = function() {
	filterLog.defineProcessor('std-out', {}, process.stdout)
}

filterLog.defaultData = {
	loggerName: 'standard'
}

filterLog.clearProcessors = function() {
	filterLog.logsProc = {}
}

filterLog.removeProcessor = function(name) {
	delete filterLog.logsProc[name] 
}

filterLog.baseInformationGenerator = function() {
	return {
		date: new Date()
	}
}

filterLog.sync = false

filterLog.levels = require('./levels')


module.exports = filterLog
