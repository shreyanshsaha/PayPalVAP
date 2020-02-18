const express = require("express");
const bodyParser = require("body-parser");

const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const middleware = require("./middleware");
const {addStudent} = require("./student");
const {addProfessor}=require("./professor");

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
  res.render("login", {
    loginType: "Student Login",
  });
});

app.post("/login/student", function (req, res) {
  console.log(req.body);
  res.render("login", {
    loginType: "Student Login",
  });
});

app.post("/register", function (req, res) {
  debugPrint('Register: ' + JSON.stringify(req.body));
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.name
  )
    return errorPrint("Incomplete Data");

  let userData = {}
  userData.username = req.body.username;
  userData.password = req.body.password;
  userData.name = req.body.name;
  userData.courses = []

  if (req.body.student) {
    userData.type = "student";
    addStudent(userData)
    .then(()=>{
      debugPrint("Student added");
      res.send("Student Added<br>"+JSON.stringify(userData))
    })
    .catch((err)=>errorPrint(err,res));
  }
  else if (req.body.professor) {
    userData.type = "professor";
    addProfessor(userData)
    .then(() => {
      debugPrint("Professor added");
      res.send("Professor Added<br>"+JSON.stringify(userData))
    })
    .catch((err) => errorPrint(err, res))
  }
  else {
    errorPrint("Invalid Type", res);
  }
});

app.get("/login/professor", function (req, res) {
  res.render("login", {
    loginType: "Professor Login",
  });
});

app.get("/student", function (req, res) {
  res.render("student");
})

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(3000, function () {
  debugPrint("Server Running");
});