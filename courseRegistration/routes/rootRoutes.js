var express = require("express");
const url=require("url");
var router = express.Router();
const middleware = require("../middleware");
const { debugPrint, errorPrint, infoPrint } = require("../printFunction")
const { authenticateStudent, addStudent, registerCourse, deleteStudent, dropCourse } = require("../student");
const { addProfessor, createCourse, deregisterCourse, deleteProfessor, authenticateProfessor } = require("../professor");
const { searchFile, getDataAsArray } = require("../fileHandling");
const { createMessage } = require("../utility");
const { getSlots } = require("../course");


router.get("/", function (req, res) {
  let registerError = req.query.regError;
  res.render("index", {
    registerError,
  });
});


router.post("/register", function (req, res) {
  debugPrint('Register: ' + JSON.stringify(req.body));
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.name
  )
    return errorPrint("Incomplete Data", res);
    console.log(/^[A-Za-z0-9]{5, 20}$/.test(req.body.username));
    console.log(/^[A-Za-z \.]+$/.test(req.body.name));
    console.log(req.body.password.length<6);
  if(!/^[A-Za-z0-9]{5,20}$/.test(req.body.username) || !/^[A-Za-z \.]+$/.test(req.body.name) || req.body.password.length<6){
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
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.send(err);

    res.redirect('/');
  })
});

module.exports = router;