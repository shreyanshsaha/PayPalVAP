

middleware = {};
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
middleware.urlStatus = function(req, res, next){
  infoPrint('Requested: '+req.method+" "+req.url);
  next();
}

module.exports = middleware;