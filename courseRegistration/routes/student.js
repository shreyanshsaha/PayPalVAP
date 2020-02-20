var express = require("express");
var router = express.Router();
const middleware = require("./middleware");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const { authenticateStudent, addStudent, registerCourse, deleteStudent, dropCourse } = require("./student");
const { addProfessor, createCourse, deregisterCourse, deleteProfessor, authenticateProfessor } = require("./professor");
const { searchFile, getDataAsArray } = require("./fileHandling");
const { createMessage } = require("./utility");
const { getSlots } = require("./course");


app.get("/login/student", function (req, res) {
  res.render("login", {
    loginType: "Student Login",
  });
});

app.post("/login/student", function (req, res) {
  authenticateStudent(escape(req.body.username), hashPassword(req.body.password))
    .then(async (userDetails) => {
      userDetails.courseDetails = [];
      // Fill Course Details
      for (let i = 0; i < userDetails.courses.length; i++) {
        let course = await searchFile("./data/course.dat", userDetails.courses[i], 'courseID');
        // console.log(course);
        userDetails.courseDetails.push(course);
      }
      userDetails.slots = await getSlots(userDetails.courses);
      req.session.user = userDetails;
      // console.log(userDetails);

      res.redirect("/student");
    })
    .catch((err) => {
      errorPrint(err);
      res.send(err.message);
    })
});

app.get("/student", function (req, res) {
  if (!req.session.user)
    return res.redirect("/");
  message = req.session.message;
  // console.log(req.session.user);
  delete req.session.message;
  return res.render("student", {
    student: req.session.user,
    message: message,
  });
})

module.exports = router;