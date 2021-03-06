// let promise = new Promise(function(resolve, reject) {
//   // the function is executed automatically when the promise is constructed

//   // after 1 second signal that the job is done with the result "done"
//   setTimeout(() => resolve("done"), 1000);
// });

// // reject runs the second function in .then
// promise.then(
//   result => console.log(result), // doesn't run
//   error => console.log(error) // shows "Error: Whoops!" after 1 second
// );


var fs = require("fs");
// const util=require("util");

// const readFile = util.promisify(fs.readFile);


function readFile(filename, encodingType) {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(filename, encodingType, (err, data) => {
      if (err) return reject(new Error(err));
      resolve(data);
    });
  });

  return promise;
}

const promise = readFile('file3.json', 'utf-8');

// promise.then((data) => {console.log(data);});
// promise.catch((err) => { console.log(err) });
// promise.finally(()=>{console.log('done')});

// promise.then((data) => JSON.parse(data)).then((data) => {
//   console.log(data);
// }).catch((err) => {
//   console.log(err);
// }).finally(() => {
//   console.log("Done");
// });


// function delay(seconds){
//   return new Promise((resolve, reject)=>{
//     setTimeout(()=>{resolve(seconds)}, seconds*1000);
//   })
//   // return promise;
// }

// delay(1).then((s)=>console.log(`Done Delay for ${s}s`));


var promiseAll = Promise.all([
  readFile("file3.json", 'utf-8'),
  readFile("file3.json", 'utf-8'),
  readFile("file4.json", 'utf-8'),
]);

promiseAll
  .then((data)=>JSON.parse.apply(null, data))
  .then((data)=>console.log(data))
  .catch((err)=>console.log(err));
