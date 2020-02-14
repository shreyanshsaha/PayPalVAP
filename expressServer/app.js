var express = require("express");
var app = express();
var _ = require("lodash");


// to support json encoded bodies
app.use(express.json());

// var userData = new Set();
var userData = [];

console.log(userData);

// Middleware
app.use(function (req, res, next) {
  var start = new Date();
  next();
  console.log("Execution time: " + (new Date() - start) + " milliseconds.");
});

app.get("/", function (req, res) {
  // console.log(req.headers);
  console.log(req.query)
  res.send("Hello World");
});

app.post("/", function (req, res) {
  console.log(req.headers['username'], req.headers['password']);
  res.send("Hello World on post");
});

app.get("/home", function (req, res) {
  res.send("Home Page");
});

app.get("/about", function (req, res) {
  res.send("About page");
});

app.get("/user/:id/:city", function (req, res) {
  console.log(req.body);
  console.log(req.body.user);
  setTimeout(() => { console.log("Waiting done") }, 1000);
  res.send('hello ' + req.params.id + ' from ' + req.params.city);
})



app.post("/adduser", function (req, res) {
  userData.push(req.body);
  console.log(userData);
  res.send("User added");
});

app.get("/user/:id", function (req, res) {
  let id = req.params.id;
  let username = req.headers['username'];
  let password = req.headers['password'];

  let userDetails = _.filter(userData, (user) => {
    return (id == user.id && password == user.password && username == user.username);
  });

  console.log(userDetails);
  res.send(userDetails);
});

app.delete("/user/:id", function (req, res) {
  let id = req.params.id;
  _.remove(userData, (value) => {
    return value.id == id;
  });
  // userData = newUserData;
  console.log(userData);
  res.send("User deleted");
})

app.get("/*", function (req, res) {
  res.send("Default page");
})

app.listen(3000, function () {
  console.log("[!] Server Running");
});


/*
post:   /adduser - user data is sent as json body (id, name, address, username,password)
get:    /user/1 - get the user data. shuold work only on the username & password passwd is valid
delete: /user/1 - delete the user

print the time of when exexcting started and ended
*/