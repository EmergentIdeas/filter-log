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
filog.defineProcessor(process.stdout)
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

A couple new things. When we created the logger on line 1, we gave it a name, `my-auth-component`. This will be used to identify all log entries created through this logger. We also set a single property that will be added to every log entry, the `hostName`. On line 2, we've used string interpolation to make it a little easier to create a message.







