const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");
const session = require("express-session");

const middleware = require("./middleware");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const { authenticateStudent, addStudent, registerCourse, deleteStudent, dropCourse } = require("./student");
const { addProfessor, createCourse, deregisterCourse, deleteProfessor, authenticateProfessor } = require("./professor");
const { searchFile, getDataAsArray } = require("./fileHandling");
const { createMessage } = require("./utility");
const { getSlots } = require("./course");


const studentRoute = require("./studentRoutes");
const professorRoutes = require("./professorRoutes");
const courseRoutes = require("./courseRoutes");


const app = express();

function hashPassword(str) {
  return escape(str);
}


app.use(session({
  key: 'user_sid',
  secret: 'paypalVAPSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {},
  // cookie: { maxAge: 60000 },
}));

app.use((req, res, next) => {
  if (req.session.user && req.path == "/")
    return res.redirect("/" + req.session.user.type);
  next();
});


app.set("view engine", "pug");
app.set("views", "./views");

// app.use(express.json());
app.use(middleware.urlStatus);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(studentRoute);
app.use(professorRoutes);
app.use(courseRoutes);

app.get("/", function (req, res) {
  let registerError = req.query.regError;
  // registerError = "sample error";
  res.render("index", {
    registerError,
  });
});


app.post("/register", function (req, res) {
  debugPrint('Register: ' + JSON.stringify(req.body));
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.name
  )
    return errorPrint("Incomplete Data", res);

  if(!/^[A-Za-z0-9]{5, 20}$/.test(req.body.username) || !(/^[A-Za-z \.]+$/.test(req.body.name)) || req.body.password.length<6){
    return res.redirect(url.format({
      pathname:"/",
      query: {
        "regError": "Invalid data format",
      },
    }));
  }

  let userData = {}
  userData.username = req.body.username.toLowerCase();
  userData.name = req.body.name.toLowerCase();
  userData.password = req.body.password;
  userData.courses = []

  if (req.body.student) {
    userData.type = "student";
    addStudent(userData)
      .then((newUserData) => {
        debugPrint("Student added");
        debugPrint(newUserData);
        req.session.user = newUserData;
        req.session.user.courseDetails = [];
        req.session.user.courses = [];
        req.session.user.slots = [];
        res.redirect("/student");
      })
      .catch((err) => {
        errorPrint(err.stack);
        return res.redirect(url.format({
          pathname: "/",
          query: {
            "regError": err.message,
          }
        }));
      });
  }
  else if (req.body.professor) {
    userData.type = "professor";
    addProfessor(userData)
      .then((newUserData) => {
        debugPrint("Professor added");
        debugPrint(newUserData);
        req.session.user = newUserData;
        req.session.user.courseDetails = [];
        res.redirect("/professor");
      })
      .catch((err) => {
        errorPrint(err.stack);
        return res.redirect(url.format({
          pathname: "/",
          query: {
            "regError": err.message,
          }
        }));
      })
  }
  else {
    errorPrint("Invalid Type", res);
  }
});

// route for user logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.send(err);

    res.redirect('/');
  })
});

app.listen(3000, function () {
  debugPrint("Server Running");
});