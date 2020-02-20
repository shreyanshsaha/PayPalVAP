var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.urlencoded({extended: false}));

app.get("/index", function(req, res){
  res.render("index", {
    title:"sample",
    message: "hello world",
    friends:0,
    count:5,
  });
});

app.get("/form", function(req, res){
  // res.send(req.query);
  res.render("form", {
    username: req.query.userUsername,
    password: req.query.userPassword
  });
});

app.post("/form", function(req, res){
  // res.send(req.query);
  res.render("form", {
    data: req.body,
  });
});

app.listen(3000, function(){
  console.log("Server Running");
});