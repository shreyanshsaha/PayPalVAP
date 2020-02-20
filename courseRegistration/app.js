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


const studentRoute = require("./routes/studentRoutes");
const professorRoutes = require("./routes/professorRoutes");
const courseRoutes = require("./routes/courseRoutes");
const rootRoutes = require("./routes/rootRoutes");

const app = express();

function hashPassword(str) {
  return escape(str);
}

app.set("view engine", "pug");
app.set("views", "./views");

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



app.use(middleware.urlStatus);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(rootRoutes);
app.use(studentRoute);
app.use(professorRoutes);
app.use(courseRoutes);

app.listen(3000, function () {
  debugPrint("Server Running");
});