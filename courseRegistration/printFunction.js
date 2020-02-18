var colors = require('colors/safe');

const appname = '[creg] '

function debugPrint(str){
  console.log(colors.cyan(appname+str));
}

function infoPrint(str){
  console.log(colors.bold(colors.brightGreen(appname+str)));
}

function errorPrint(str, res){
  error = new Error(str)
  console.log(colors.red(appname+error.stack));
  if(res)
    res.send(str);
}

module.exports.debugPrint = debugPrint;
module.exports.errorPrint = errorPrint;
module.exports.infoPrint = infoPrint;

