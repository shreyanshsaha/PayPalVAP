var fs = require("fs");

function readFile(filename, _, _) {
  encodingType = 'utf-8';
  let promise = new Promise((resolve, reject) => {
    fs.readFile(filename, encodingType, (err, data) => {
      if (err) return reject(new Error(err));
      resolve(data);
    });
  });
  return promise;
}

function getFileList(filename, encodingType) {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(filename, encodingType, (err, data) => {
      if (err) return reject(new Error(err));
      data = JSON.parse(data);
      data = data.map(readFile)
      resolve(data);
    });
  });
  return promise;
}

getFileList("./filelist.json", 'utf-8')
  .then((promiseList) => {
    var promiseAll = Promise.all(promiseList);
    promiseAll
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  })



