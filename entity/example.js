"use strict";

module.exports = function($) {
    return $.require([
        'hyperion!build.js',
        'hyperion!discovery.js',
        'module!/entity/build.js'
    ], function(
        build,
        discovery,
        util
    ) {

        var obj = {
            run: function() {
                var p = $.promise();

                setTimeout(function() {
                    console.log('done script');
                    p.resolve();
                }, 500);

                return (p);
            },
            test: function(machine, endpoint, data) {
                return (util.test(machine, data, endpoint, '/health', function (res) {
                    var code = Math.floor(res.req.statusCode / 100);
                    return (code == 2 || code == 3 && $.json.parse(res.body));
                }, function (out) {
                    out.type.namespace = data.meta.namespace || 'global';
                    return (out);
                }));
            }
        };

        var p = '/usr/src/project/';

        discovery.add(util.image('health'), obj);
        build.add(util.image('api'), build.create().from('node:8')
            .copy('app/', p + 'app')
            .copy('Singularity/', p + 'Singularity')
            .copy('main.js', p + 'main.js')
            .run('ls -la ' + p)
            .run('rm -Rf ' + p + 'Singularity/engine/node_modules')
            .run('rm -Rf ' + p + 'Singularity/engine/package.json')
            .workdir(p)
            .cmd('["node", "--max-old-space-size=8192", "main.js"]').script(obj.run));

        return ({'private': obj});
    });
};
