const fs = require("fs");
const util = require("util");

const appendFile = util.promisify(fs.appendFile);
const readFile = util.promisify(fs.readFile);

function addToFile(filename, data){
  if(!(typeof data=="string"))
    throw new Error("Invalid Data, String expected")
  return appendFile(filename, data+"\n");
}

function getDataAsArray(filename){
  // TODO: Add only if username doesnt already exists
  return new Promise((resolve, reject)=>{
    fs.readFile(filename)
      .then((data)=>{
        let lines = data.split("\n");
        let dataframe=[];
        for(const line in lines){
          dataframe.push(JSON.parse(line));
        }
        resolve(dataframe);
      })
      .catch((err)=>{
        reject(new Error(err));
      });
  });
}

module.exports.addToFile = addToFile;
module.exports.getDataAsArray = getDataAsArray;