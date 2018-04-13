var cookies = {
    get: function(req, key) {
        if(!req.headers["cookie"]) {
            return;
        }
        var cks = req.headers["cookie"].toString().split(";");
        for(index = 0; index < cks.length; index++) {
            var cksKey = cks[index].trim().split("=")[0];
            var value = cks[index].trim().split("=")[1];
            if(cksKey == key) {
                return value;
            }
        }
        return null;
    }
}
exports.cookies = cookies;