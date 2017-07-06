# filter-log

flexible, minimalistic event-bus style logging

## Description

Logging is really two things.

1. Creating information about what code is doing.
2. Doing something with that information (like saving it or filtering it).

Filter log separates those concerns using the event bus pattern. Code that produces log entries get tools that make event log entries easy to create and informational. The application can set up how log events will be captured and saved. Log events are JS objects so we can save lots of information.

## The Basic Boring Example

```
var filog = require('filter-log')
filog.defineProcessor('standard', {}, process.stdout)
var log = filog()
log.info('hello, world!')
```

Here we've done the basics. Line 2 creates a processor which is listening for log entries. It has no filter and will log absolutely everything. Since no transformer was specfied, the log entries will be formatted as streamable JSON.

Line 3 creates a new logger. It has the basic tools you'd expect for logging by level and string interpolation. Line 4 creates a new log entry, sets the level to "info" and publishes it.

If you run this example, a JSON formatted log entry will show up in stdout.

## Logging more Data

Strings are fine, but objects contain more information. Let's log an object.

```
log.write({ event: 'vip login', firstName: 'John'})
```

The object above will be augmented with date information and (given the processor set up in the first example) logged to std out. Filter log loggers are streams. You can write and pipe data to them like normal streams.

## Letting the Logger Help

Lots of times the logger will have contextual information you want to save with every log entry. This could be just the name of the component creating the log entry or could be selected configuration items that are determing behavior or environmental information that will help with debugging. Let's create a logger which with will help us keep our code DRY.


```
var log = filog('my-auth-component', { hostName: require('os').hostname() })
log.info('successful log in for %s', userName)
```

A couple new things. When we created the logger on line 1, we gave it a name, `my-auth-component`. This will be used to identify all log entries created through this logger. We also set a single property that will be added to every log entry, the `hostName`. On line 2, we've used string interpolation to make it a little easier to create a message. If an entry is created with a string, it still shows up in the destination as a JSON object. The entry has a member of `msg` which contains the string.

The last example is something the code creating the log entries would do. What if the application environment wanted to add extra info to the log entries? It would do it like this:

```
filog.defineLoggerBaseData('my-auth-component', { appVariable: varValue })
```

It doesn't matter whether a logger with this name is ever created or not. If one is, and it's used, the entries will contain the extra information.

## Doing Something with Log Entries

In our first example we created a processor which logs absolutely everything. That might be a shocking amount of trace data. Instead of that, what if we only wanted to log the error level information?

```
var filog = require('filter-log')
filog.defineProcessor(
	'standard', 
	{}, 
	process.stdout, 
	function(entry) {
		return entry.level && entry.level >= filog.levels.ERROR
	}
)
```

What if we wanted info level and above logs from the `http-requests` logger to go to a file?
```
var filog = require('filter-log')
var fs = require('fs')
filog.defineProcessor(
	'requests-processor', 
	{}, 
	fs.createWriteStream('./access-log.JSON'), 
	function(entry) {
		return entry.level && entry.level >= filog.levels.INFO && entry.loggerName === 'http-requests'
	}
)
```

Arguments are:
1. The name of the processor.
2. Any data which should be included with the log entry
3. The destination where the log entries will go (a stream)
4. A function which returns true if the entry should be included (optional, may also be a transform stream). By default all entries are included.
5. A formatter (optional, a function or transform stream) which will take the JS object and transform it into a form the destination stream wants. By default, if the destination is a character stream, this is a JSON serialization of the JS object to a streamable JSON format. If the destination is an object mode stream, it doesn't transform the object at all.

Basically, the whole concept of filter-log is that creating, filtering, serializing, and writing info is dead simple in JavaScript. All that's really needed is a couple pieces of framework goo to tie them together and provide defaults.


## MISC Management

To get rid of a processor you can call `filog.removeProcessor(name)` to remove a specific processor or `filog.clearProcessors()` to remove them all. 

`filog.baseInformationGenerator` is a function run to generate the dynamic information for the log entry, like the current time. It's safe to override but will get run for every log entry created, so don't put anything expensive in there. Just return any object.

If you want to enter an object to be logged without benefit of going through any of the loggers or having it timestamped, you can have it processed by calling `filog.writeToProcessors(entry)`.


## Log Post-processing

The pattern with JSON based logging is to save a gross amount of data and filter that down to what you want to see. Filter log contains a command line utility `filter-log` which can do some basic filtering and formatting. You can check out its man page for exact capabilities. Basic usage is:

```
cat my-log.json | filter-log > my-log.txt
```

Anything complicated though, and it may be much easier to write your own tiny program to process the entries. `exmaples/process-1.js` is a simple example. The source for `filter-log-command.js` may also serve as an example.





