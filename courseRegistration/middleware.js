

middleware = {};
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
middleware.urlStatus = function(req, res, next){
  infoPrint('Requested: '+req.method+" "+req.url);
  if(req.method=="post")
    infoPrint('Data sent using post: '+JSON.stringify(req.body));
  next();
}

module.exports = middleware;