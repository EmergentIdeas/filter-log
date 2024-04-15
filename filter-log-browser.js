function createTransformFunctionFromStream(stream) {
	stream.innerFilter = stream.transform || stream._transform
	let last

	stream.push = function(pushed) {
		last = pushed
	}

	return function(data) {
		last = null
		stream.innerFilter(data, 'utf-8', function(){})
		return last
	}
}

function isNullish(data) {
	return typeof data === 'undefined' || typeof data === 'null' 
}


function writeToProcessors(data) {
	Object.values(filterLog.logsProc).forEach(processor => processor.head.write(data))
}

function makeLogger(name, stream) {
	stream._name = name
	
	stream.write = function(data, enc, callback) {
		if(typeof data == 'string') {
			data = {
				msg: data
			}
		}
		writeToProcessors(Object.assign(filterLog.baseInformationGenerator(), 
		{loggerName: name}, filterLog.logsData[name], stream.loggerSpecificData, data))

		if(callback) {
			callback()
		}
	}
	
	Object.keys(filterLog.levels).forEach(key => {
		stream[key.toLowerCase()] = function(data) {
			if(typeof data == 'string') {
				data = {
					msg: data
				}
				
				let args = [...arguments]
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
			
			if(args.length > 0 && typeof args[0] == 'object') {
				initData = args.shift()
				loggerName = initData.loggerName || loggerName
				hasSpecificData = true
			}
		}
		else if(typeof first == 'object') {
			loggerName = first.loggerName || loggerName
			initData = first
			hasSpecificData = true
		}
	}
	
	initData.loggerName = loggerName
	
	var logger = makeLogger(loggerName, {})
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
		destination: destination || console.log,
		baseData: Object.assign({}, baseData, { processorName: name }),
		
		// should be a function or stream of some sort
		filter: filter || function(item) { return true }
	}
	
	// should be a function or stream of some sort
	if(transformer) {
		procData.transformer = transformer
	}
	else {
		if(procData.destination._writableState && procData.destination._writableState.objectMode == false) {
			procData.transformer = ((data) => { return JSON.stringify(data) + '\n' })
		} 
		else {
			procData.transformer = ((data) => { return data })
		}
	}
	
	if(typeof procData.filter === 'object') {
		// Assume this is a stream then
		procData.filter = createTransformFunctionFromStream(procData.filter)
	}
	if(typeof procData.transformer === 'object') {
		// Assume this is a stream then
		procData.transformer = createTransformFunctionFromStream(procData.transformer)
	}

	procData.head = {
		write(data) {
			if(isNullish(data)) {
				return
			}
			let included = procData.filter(data)
			
			if(isNullish(included)) {
				// it was probably transformed by a filtering stream
				return
			}
			if(typeof included === 'boolean') {
				if(!included) {
					return
				}
			}
			else if(typeof included === 'object') {
				// it was probably transformed by a filtering stream
				data = included
			}
			
			if(isNullish(data)) {
				return
			}

			data = procData.transformer(data)
			if(isNullish(data)) {
				return
			}
			
			
			if(procData.destination.write) {
				// probably a stream
				procData.destination.write(data)
			}
			else if(typeof procData.destination === 'function') {
				procData.destination(data)
			}
		}
	}
	
	filterLog.logsProc[name] = procData
}

filterLog.createStdOutProcessor = function() {
	filterLog.defineProcessor('std-out', {}, console.log)
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

filterLog.levels = require('./levels')


module.exports = filterLog