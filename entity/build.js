"use strict";

module.exports = function($) {
    return $.require([
        'node!https',
        'node!http',
        'module!/entity/build/image.js'
    ], function (
        https,
        http,
        util
    ) {

        var obj = function() {};
        obj.prototype = {
            _response: {
                success: function(machine, data) {
                    var now = $.time.now().get;
                    return ({
                        last: {
                            alive: now,
                            ping: now
                        },
                        alive: true,
                        name: data.key,
                        endpoint: data.endPoint,
                        type: {
                            machine: machine,
                            image: data.image
                        }
                    })
                },
                error: function (machine, data) {
                    return ({
                        last: {
                            ping: $.time.now().get
                        },
                        alive: false,
                        name: data.key,
                        endpoint: data.endPoint
                    });
                }
            },

            request: function(endpoint, path) {
                var p = new $.promise(), url = endpoint.replace(/https*:\/\//g, '').split(':');

                var req = (endpoint.match(/https:\/\//) ? https : http).request({
                    host: url[0],
                    port: url[1],
                    path: path,
                    method: 'GET',
                    rejectUnauthorized: false
                }, function (res) {
                    var body = [];
                    res.on('data', function (data) {
                        body.push(data);
                    });

                    res.on('end', function () {
                        //console.log(endpoint, url, path, body, res.statusCode);
                        p.resolve({req: res, body: body.join('')});
                    });
                });
                req.on('error', function (err) {
                    console.log(err);
                    p.reject(err);
                });
                req.end();

                return (p);
            },

            test: function(machine, data, endpoint, url, test, format) {
                var self = this;
                return (this.request(endpoint, url).then(function (res) {
                    if (test) {
                        var t = test(res), out = self._response[(t) ? 'success' : 'error'](machine, data);
                        if (t && format) {
                            return (format(out));
                        }
                        return (out);
                    }
                    return (self._response.success(machine, data));
                }, function () {
                    return (self._response.error(machine, data));
                }));
            },

            image: function() {
                return (util.image.apply(util, arguments));
            }
        };

        return ({'static public': obj});
    });
};