var express = require("express");
var router = express.Router();
const middleware = require("./middleware");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const { authenticateStudent, addStudent, registerCourse, deleteStudent, dropCourse } = require("./student");
const { addProfessor, createCourse, deregisterCourse, deleteProfessor, authenticateProfessor } = require("./professor");
const { searchFile, getDataAsArray } = require("./fileHandling");
const { createMessage } = require("./utility");
const { getSlots } = require("./course");


function hashPassword(str) {
  return escape(str);
}

router.get("/login/student", function (req, res) {
  res.render("login", {
    loginType: "Student Login",
  });
});

router.post("/login/student", function (req, res) {
  authenticateStudent(escape(req.body.username), hashPassword(req.body.password))
    .then(async (userDetails) => {
      console.log(userDetails);
      userDetails.courseDetails = [];
      userDetails.course=[];
      // Fill Course Details
      for (let i = 0; i < userDetails.courses.length; i++) {
        let course = await searchFile("./data/course.dat", userDetails.courses[i], '_id');
        userDetails.course.push(course._id);
        course.professorDetails = await searchFile("./data/professor.dat", course.professor, '_id')
        userDetails.courseDetails.push(course);
      }
      userDetails.slots = await getSlots(userDetails.courses);
      req.session.user = userDetails;
      res.redirect("/student");
    })
    .catch((err) => {
      errorPrint(err);
      res.send(err.message);
    })
});

router.get("/student", middleware.isStudent, function (req, res) {
  if (!req.session.user)
    return res.redirect("/");
  message = req.session.message;
  delete req.session.message;
  console.log("/student", req.session.user);
  return res.render("student", {
    student: req.session.user,
    message: message,
  });
})

module.exports = router;