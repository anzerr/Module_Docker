"use strict";

module.exports = function($) {
    return $.require([
        //
    ], function(
        //
    ) {

        var obj = function() {};
        obj.prototype = {
            image: function(name) {
                return ($.config.get('docker.build.login') + '/' + name);
            }
        };

        return ({'static private': obj});
    });
};
