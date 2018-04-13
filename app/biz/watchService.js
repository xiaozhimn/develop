var tools = require("../common/tools").tools;
var watcherDao = require("../dao/watcher").watcher;
var watchService = {
    addVisitor: function(params, callback) {
        watcherDao.addVisitor(params, function(result) {
            callback(result);
        });
    }
}
exports.watchService = watchService;