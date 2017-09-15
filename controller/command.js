"use strict";

module.exports = function($) {
	return $.require([
		'module!/entity/build.js'
	], function(
		util
	) {

		var obj = function() {};
		obj.prototype = {
			release: function(data) {
				var s = $.service('hyperion'), tag = ((data.body.tag) ? '-' + data.body.tag : '');
				var ver = new $.promise(), done = false, build = {name: util.image(data.body.release), version: data.body.version || '0.0.0'};

				if (data.body.version) {
					ver.resolve();
				} else {
					setTimeout(function() {
						if (!done) {
							done = true;
							ver.resolve();
						}
					}, 10000);
					s.version.get(build.name).then(function(res) {
						return (res);
					}, function(err) {
						return (s.version.update(build.name));
					}).then(function(res) {
						if (!done) {
							done = true;
							build.version = res;
							ver.resolve();
						}
					}, function(err) {
						if (!done) {
							done = true;
							ver.resolve();
						}
					});
				}

				return (ver.then(function() {
					console.log(build, tag);
					return (s.release({name: build.name, version: build.version + tag}));
				}, function(err) {
					console.log('done', err);
					process.exit();
				}).then(function() {
					console.log('done');
					if (!data.body.version) {
						return (s.version.update(build.name));
					}
					return (true);
				}, function() {
					return (true);
				}).then(function() {
					process.exit();
					return (true);
				}));

			}
		};

		return ({'static private': obj});
	});
};
