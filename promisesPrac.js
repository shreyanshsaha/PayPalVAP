let promise = new Promise(function(resolve, reject) {
  // the function is executed automatically when the promise is constructed

  // after 1 second signal that the job is done with the result "done"
  setTimeout(() => resolve("done"), 1000);
});

// reject runs the second function in .then
promise.then(
  result => console.log(result), // doesn't run
  error => console.log(error) // shows "Error: Whoops!" after 1 second
);