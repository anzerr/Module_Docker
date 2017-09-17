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
		},
		{
			api: ['command'],
			path: '/hyperion/buildfile',
			action: {
				controller: 'command',
				method: 'buildFile'
			}
		}
	]);
};
