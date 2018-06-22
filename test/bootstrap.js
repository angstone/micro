//'use strict'

(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

global.Hemera = require('../node_modules/nats-hemera')
global.HemeraSymbols = require('../node_modules/nats-hemera/lib/symbols')
global.HemeraUtil = require('../node_modules/nats-hemera/lib/util')
global.Code = require('code')
global.Hp = require('../node_modules/hemera-plugin')
global.Sinon = require('sinon')
global.HemeraTestsuite = require('hemera-testsuite')
global.expect = global.Code.expect
global.UnauthorizedError = Hemera.createError('Unauthorized')

process.setMaxListeners(0)
