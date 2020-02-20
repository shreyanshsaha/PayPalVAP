var colors = require('colors/safe');

const appname = '[creg] '

function debugPrint(str){
  console.log(colors.cyan(appname+str));
}

function infoPrint(str){
  console.log(colors.bold(colors.brightGreen(appname+str)));
}

function errorPrint(err){
  error=err
  if(!(err instanceof Error))
    error = new Error(err)

  console.log(colors.red(appname+error.stack));
}

module.exports.debugPrint = debugPrint;
module.exports.errorPrint = errorPrint;
module.exports.infoPrint = infoPrint;

