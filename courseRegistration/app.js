const express = require("express");
const bodyParser = require("body-parser");

const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const middleware = require("./middleware");
const {addToFile} = require("./fileHandling");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

// app.use(express.json());
app.use(middleware.urlStatus);
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login/student", function (req, res) {
  res.render("login");
});

app.post("/login/student", function (req, res) {
  console.log(req.body);
  res.render("login");
});

app.post("/register", function (req, res) {
  debugPrint('Register: '+JSON.stringify(req.body));
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.id ||
    !req.body.name
  )
    return errorPrint("Incomplete Data");
  if(req.body.student)
    addToFile("data/student.dat", JSON.stringify(req.body))
      .then(()=>res.send("Updated student"))
      .catch((err)=>errorPrint(err, res));
  else if(req.body.professor)
    addToFile("data/professor.dat", JSON.stringify(req.body))
    .then(()=>res.send("Updated professor"))
    .catch((err)=>errorPrint(err, res));
  else
    errorPrint("Invalid Type", res);
});

app.get("/login/professor", function (req, res) {
  res.render("login");
});

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(3000, function () {
  debugPrint("Server Running");
});