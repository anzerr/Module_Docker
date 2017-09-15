"use strict";

module.exports = function() {
	return ([
		{
			api: ['command'],
			path: '/hyperion/release',
			action: {
				controller: 'command',
				method: 'release'
			}
		}
	]);
};
