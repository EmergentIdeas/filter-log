var levels = require('../levels')

var filterCreator = function(targetLevel) {
	if(typeof targetLevel == 'string') {
		targetLevel = levels[targetLevel.toUpperCase()]
	}
	
	var filter = function(data) {
		return targetLevel && data.level && data.level >= targetLevel
	}
}


module.exports = filterCreator